import { AfterViewInit, Component } from '@angular/core';
import maplibregl, { Popup } from 'maplibre-gl';
import { ApiService } from '../services/contratos/contratos.service';
import { AppModule } from '../app.module';




@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent {
  apiKey = "v1.public.eyJqdGkiOiJiZjA5NjY4MS1lNjBlLTQ3NjEtODE1NS04MTA3N2VlMWNiNTEifTeO-jM5cgo2q0aCF5-5CtyFzHJCmiVFTtMvb63TqPuCgRHzgAp4fToOmh0qi5GP6zsNF3cyXkeoOiwBfyDC4zsU6QO-xzjHHzG3tZ19VBwVDnE49556GGEsA-nkfhLgM64WzpJNt_v2C8sZfbl_Pr4EabQDnz8--1r6pe4qcbN4wwpZetb6RxwGfjIkSxSLshpqGCvUSISrzS3jrxhOkp_mbOBx-L8jumjc8YT3NTsmvPS0sdEGmDk5516PX4wRBwHR_Ry2wlbbfq-gH5AMkNZb28KhyVVGezJ3HNhV32FlOPfrbmEovAa-s2DOUZBR00MkZW8wIPgpter9ihwFs5c.ZTA0NDFlODYtNGY5Mi00NWU4LTk1MDgtMmY4YmViYWFhYjUz";
  mapName = "Tracking_Karrara_Claro";
  region = "sa-east-1";
  markerImagePath: string = 'assets/truck.png';
  posicao!: any[];
  urlAtualiza: string = 'https://uj88w4ga9i.execute-api.sa-east-1.amazonaws.com/dev12';
  urlConsulta: string = 'https://4i6nb2mb07.execute-api.sa-east-1.amazonaws.com/dev13';
  query: string = 'Operacao_Interplantas_Karrara';
  query2: string = 'veiculos_lab_Karrara'
  placaFiltrada: string = '';
  posicaoSul!: any[];


  constructor(
    private dynamodbService: ApiService,

  ) { }


  markerCoordinates: [number, number][] = [

  ];

  ngOnInit() {
    this.getPosicaoFromDynamoDB();
    setTimeout(() => {
      if (this.posicao !== undefined) {
        this.markerCoordinates = this.posicao
          .filter((item: any) => item.Longitude !== undefined && item.Latitude !== undefined)
          .map((item: any) => [item.Longitude, item.Latitude]);
      }
      this.inicia();
    }, 1500);

  }
  filtrar(): void {
    // Aqui você pode implementar a lógica para filtrar os marcadores com base no valor da placa inserida no input
    // Você pode usar a propriedade `placaFiltrada` para acessar o valor do input
    // Por exemplo, você pode filtrar `this.markerCoordinates` com base na placa filtrada e atualizar os marcadores no mapa
  }





  inicia(): void {
    const map = new maplibregl.Map({
      container: "map",
      style: `https://maps.geo.${this.region}.amazonaws.com/maps/v0/maps/${this.mapName}/style-descriptor?key=${this.apiKey}`,
      center: [-46.56665783189564, -23.712571371830165],
      zoom: 12,
      transformRequest: (url, resourceType) => {
        if (url.startsWith("https://api.mapbox.com")) {
          // Adicione a chave de acesso como parâmetro na URL da requisição
          url += "&access_token=" + this.apiKey;
        }
        return { url };
      }
    });

    this.markerCoordinates.forEach(coordinates => {
      const marker = new maplibregl.Marker({ element: this.createMarkerElement(this.markerImagePath) })
        .setLngLat(coordinates)
        .addTo(map);

      const endereco = this.getPosicaoEndereco(coordinates); // Obtenha o endereço com base nas coordenadas
      const placa = this.getPosicaoPlaca(coordinates); // Obtenha o endereço com base nas coordenadas

      const popup = new Popup({ closeButton: false, closeOnClick: false })
        .setLngLat(coordinates)
        .setHTML(`Placa: ${placa}<br>Longitude: ${coordinates[0]}<br>Endereço: ${endereco}`);

      marker.getElement().addEventListener('mouseover', () => {
        popup.addTo(map);
      });

      marker.getElement().addEventListener('mouseout', () => {
        popup.remove();
      });
    });
  }



  private getPosicaoEndereco(coordinates: [number, number]): string {
    const posicao = this.posicao.find(item => item.Longitude === coordinates[0] && item.Latitude === coordinates[1]);
    if (posicao && posicao.Endereco) {
      return posicao.Endereco;
    }
    return ""; // Retorne uma string vazia caso não tenha um endereço correspondente
  }

  private getPosicaoPlaca(coordinates: [number, number]): string {
    const posicao = this.posicao.find(item => item.Longitude === coordinates[0] && item.Latitude === coordinates[1]);
    if (posicao && posicao.Plate) {
      return posicao.Plate;
    }
    return ""; // Retorne uma string vazia caso não tenha um endereço correspondente
  }

  getPosicaoFromDynamoDB(): void {
    const filtro = 'all';
    this.dynamodbService.getItems(this.query, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.posicao = items
                .map(item => ({ ...item, checked: false }));
              // Adiciona a chave 'checked' a cada item, com valor inicial como false
              // Filtra os itens com chave 'DataBordo' indefinida
            } else {
              console.error('Invalid items data:', items);
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        } else {
          console.error('Invalid response:', response);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getPosicaoMilkSulFromDynamoDB(): void {
    const filtro = 'all';
    this.dynamodbService.getItems(this.query2, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.posicaoSul = items
                .map(item => ({ ...item, checked: false }));
              // Adiciona a chave 'checked' a cada item, com valor inicial como false
              // Filtra os itens com chave 'DataBordo' indefinida
            } else {
              console.error('Invalid items data:', items);
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        } else {
          console.error('Invalid response:', response);
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }


  private createMarkerElement(imageUrl: string): HTMLDivElement {
    const element = document.createElement('div');
    element.className = 'small-marker';

    const image = document.createElement('img');
    image.src = imageUrl;
    element.appendChild(image);

    return element;
  }
}
