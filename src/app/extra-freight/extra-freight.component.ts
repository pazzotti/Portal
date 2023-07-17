import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../services/contratos/contratos.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ContratoTransportadoraFormDialogComponent } from '../app/home/contrato_transportadora/contrato-transportadora-form-dialog.component';
import { Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { format } from 'date-fns';
import { ContratoTerrestreFormDialogComponent } from '../app/home/contrato_terrestre/contrato-terrestre-form-dialog.component';
import { ExtraRequestComponent } from '../app/home/extra-request/extra-request.component';
import { UsuarioLogado } from '../autenticacao/usuario-logado.type';
import { AutenticacaoService } from '../autenticacao/autenticacao.service';
import { AppModule } from '../app.module';


@Component({
  selector: 'app-extra-freight',
  templateUrl: './extra-freight.component.html',
  styleUrls: ['./extra-freight.component.css']
})
export class ExtraFreightComponent {
  urlAtualiza: string = 'https://uj88w4ga9i.execute-api.sa-east-1.amazonaws.com/dev12';
  urlConsulta: string = 'https://4i6nb2mb07.execute-api.sa-east-1.amazonaws.com/dev13';
  query: string = 'extraFreight';
  querylocation: string = 'Fornecedores_Karrara_Transport';
  data: any;
  base: number = 3;
  ID: number = Date.now();
  comentario: string = "";
  exponent: number = 22;
  $even: any;
  $odd: any;
  dataSource: any;
  dialogRef: any;
  items$!: Observable<any[]>;
  items: any[] = [];
  itemsCarrier: any[] = [];
  itemsCompletos: any[] = [];
  filtroDelivery: string = '';
  itemsOrigin: any[] | undefined;
  placesOrigin: any[] | undefined;
  edit: boolean = false;
  usuarioLogado!: UsuarioLogado;


  typesVehicles: string[] = [
    'Picape(fiorino) Aberta 500Kg - C1,60 x L1,00 x A1,20',
    'Picape(fiorino) Fechada - C1,60 x L1,00 x A1,20',
    'Picape(fiorino) Refrigerada - C1,60 x L1,00 x A1,20',
    'Kombi 800kg - C1,60 x L1,00 x A1,20',
    'VAN Furgão 1,5t - C3,20 x L1,80 x A1,80',
    'HR Bongo 1,5t - C2,80 x L1,80 x A1,80',
    'HR Bongo Sider 1,5t - C2,80 x L1,80 x A1,80',
    'HR Bongo Aberto 1,5t - C2,80 x L1,80 x A1,80',
    'HR Bongo Refrigerado 1,5t - C2,80 x L1,80 x A1,80',
    'VUC - 3/4 3t - C4,80 x L2,20 x A2,20',
    'VUC - 3/4 Aberto 3t - C4,80 x L2,20 x A2,20',
    'VUC - 3/4 Sider 3t - C4,80 x L2,20 x A2,20',
    'VUC - 3/4 Refrigerado 3t - C4,80 x L2,20 x A2,20',
    'Toco Aberto 6ton - C6,50 x L2,40 x A2,60',
    'Toco Sider 6ton - C6,50 x L2,40 x A2,60',
    'Toco 6ton Refrigerado - C6,50 x L2,40 x A2,60',
    'Truck Aberto 12ton - C8,50 x L2,40 x A2,70',
    'Truck Sider 12ton - C8,50 x L2,40 x A2,70',
    //'Truck Refrigerado 12ton - C8,50 x L2,40 x A2,70',
    'Carreta 25ton Aberta - C14,80 x L2,50 x A2,70',
    'Carreta 25ton Sider - C14,80 x L2,50 x A2,70',
    //'Carreta 25ton Baú - C14,80 x L2,50 x A2,70',
    'Carreta 27ton Aberta - C14,80 x L2,50 x A2,70',
    'Carreta 27ton Sider - C14,80 x L2,50 x A2,70',
    //'Carreta 27ton Baú - C14,80 x L2,50 x A2,70',
    'Truck Munk',
    'Guincho Prancha'
  ];


  constructor(
    public dialog: MatDialog,
    private dynamodbService: ApiService,
    private autenticacaoService: AutenticacaoService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.getItemsFromDynamoDB();
    this.getItemsFromOrigin();
    this.getUserLogado()
    // this.adicionarPropriedadeStatusClass()
    // this.checkUser();
  }

  aplicarFiltro() {
    this.items = this.itemsCompletos;

    console.log('entrou no filtro')
    console.log(this.items)
    console.log(this.itemsCompletos)
    // Filtrar os itens com base no valor do filtro "Carrier"
    this.items = this.items.filter(item => item.locationDelivery?.toLowerCase().includes(this.filtroDelivery?.toLowerCase()));
  }

  getUserLogado() {
    console.log("logado")
    // console.log(this.autenticacaoService?.obterUsuarioLogado())
    this.usuarioLogado = this.autenticacaoService.obterUsuarioLogado()
    console.log(this.usuarioLogado)
  }


  getStatusClass(status: string): string {
    if (status == 'Planned') {
      return 'planned';
    } else if (status == 'Executing') {
      return 'executing';
    } else if (status == 'Completed') {
      return 'completed';
    } else if (status == 'Canceled') {
      return 'canceled';
    } else if (status == 'Rejected') {
      return 'rejected';
    } else {
      return '';
    }
  }

  // adicionarPropriedadeStatusClass() {
  //   this.items.forEach((item, index) => {
  //     this.itemClass[index] = this.getStatusClass(item.status);
  //     console.log(this.itemClass[index])
  //   });
  // }


  editDialog(item: Array<any>, url: string, table: string): void {
    this.edit = true;
    const dialogRef: MatDialogRef<ExtraRequestComponent> = this.dialog.open(ExtraRequestComponent, {
      data: {
        itemsData: item,
        url: url,
        query: table
      },
      height: '730px',
      minWidth: '750px',
      position: {
        top: '10vh',
        left: '30vw'
      },
    });
    console.log('passou')
    dialogRef.afterClosed().subscribe(() => {
      // if (result) {
      setTimeout(async () => {
        this.getItemsFromDynamoDB();
      }, 800); // Ajuste o tempo de atraso conforme necessário
    }
      //console.log('The dialog was closed');
  //}
);
    this.edit = false;
  }

  openDialog(item: Array<any>, url: string, table: string): void {
    const dialogRef: MatDialogRef<ExtraRequestComponent> = this.dialog.open(ExtraRequestComponent, {
      data: {
        itemsData: [],
        url: url,
        query: table
      },
      height: '730px',
      minWidth: '750px',
      position: {
        top: '10vh',
        left: '30vw'
      },
    });
    dialogRef.afterClosed().subscribe(() => {
     // if (result) {
        setTimeout(() => {
          this.getItemsFromDynamoDB();
        }, 800); // Ajuste o tempo de atraso conforme necessário
      }
     // console.log('The dialog was closed');
   // }
    );
  }

  // checkUser() {
  //   if(this.usuarioLogado.role == '3')
  //     this.items = this.itemsCarrier
  // }



  getItemsFromOrigin(): void {
    const filtro = '';
    this.dynamodbService.getItems(this.query, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.itemsOrigin = items.map(item => ({ ...item, checked: false }));
              // Adiciona a chave 'checked' a cada item, com valor inicial como false
              this.placesOrigin = this.itemsOrigin.map(item => item.local);

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

  getItemsFromDynamoDB(): void {
    const filtro = 'all';
    this.dynamodbService.getItems(this.query, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        console.log(response)
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.items = items.map(item => ({ ...item, checked: false }));
              this.itemsCompletos = items.map(item => ({ ...item, checked: false }));
              this.itemsCarrier = items.filter(item => item.carrier == this.usuarioLogado.company)

              if (this.usuarioLogado.role == '3'){
                this.items = items.filter(item => item.carrier == this.usuarioLogado.company)
              }

              console.log(this.items)
              console.log(this.itemsCarrier)
              // Adiciona a chave 'checked' a cada item, com valor inicial como false
              // Forçar detecção de alterações após atualizar os dados
              this.cdr.detectChanges();
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

  deleteItem(ID: string, urlDeleta: string, query: string): void {
    this.dynamodbService.deleteItem(ID, this.urlAtualiza, this.query).subscribe(
      response => {
        setTimeout(() => {
          this.getItemsFromDynamoDB();
        }, 400); // Ajuste o tempo de atraso conforme necessário
      },
      error => {
        // Lógica para lidar com erros durante a deleção do item
      }
    );

  }

}

