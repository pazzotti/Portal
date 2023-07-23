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
import { Validators } from '@angular/forms';


@Component({
  selector: 'app-extra-freight',
  templateUrl: './extra-freight.component.html',
  styleUrls: ['./extra-freight.component.css']
})
export class ExtraFreightComponent {
  item: any = {
    ID: '',
    local: '',
    cor: '',
    descricao: '',
    latitude: '',
    longitude: ''
  };
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
  dialogOpen!: boolean;
  formBuilder: any;
  formGroup: any;


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
  }

  editDialog(item: any): void {
    this.item.ID = item.ID
    this.item.motive = item.motive;
    this.item.nf = item.nf;
    this.item.nfTotal = item.nfTotal;
    this.item.weight = item.weight;
    this.item.quantity = item.quantity;
    this.item.carrier = item.carrier;
    this.item.reqVehicle = item.reqVehicle;
    this.item.vehicleType = item.vehicleType;
    this.item.description = item.description;
    this.item.reqName = item.reqName;
    this.item.reqId = item.reqId;
    this.item.region = item.region;
    this.item.reqEmail = item.reqEmail;
    this.item.reqPhone = item.reqPhone;
    this.item.supEmail = item.supEmail;
    this.item.costCenter = item.costCenter;
    this.item.projectNumber = item.projectNumber;
    this.item.orderNumber = item.orderNumber;
    this.item.locationPickup = item.locationPickup;
    this.item.areaPickup = item.areaPickup;
    this.item.addressPickup = item.addressPickup;
    this.item.cityPickup = item.cityPickup;
    this.item.statePickup = item.statePickup;
    this.item.cepPickup = item.cepPickup;
    this.item.datePickup = item.datePickup;
    this.item.timePickup = item.timePickup;
    this.item.locationDelivery = item.locationDelivery;
    this.item.areaDelivery = item.areaDelivery;
    this.item.dateDelivery = item.dateDelivery;
    this.item.addressDelivery = item.addressDelivery;
    this.item.cityDelivery = item.cityDelivery;
    this.item.stateDelivery = item.stateDelivery;
    this.item.cepDelivery = item.cepDelivery;
    this.item.timeDelivery = item.timeDelivery;
    this.item.notes = item.notes;
    this.item.critical = item.critical;
    this.item.dangerousProduct = item.dangerousProduct;
    this.item.status = item.status;

    this.dialogOpen = true;

  }

  salvar() {

    if (this.item.ID === undefined) {
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'ddMMyyyyHHmmss');
      console.log(formattedDate);

      this.item = {
        "ID": formattedDate.toString(),
        "motive": this.item.motive,
        "nf":this.item.nf,
        "nfTotal":this.item.nfTotal,
        "weight":this.item.weight,
        "quantity":this.item.quantity,
        "carrier":this.item.carrier,
        "reqVehicle":this.item.reqVehicle,
        "vehicleType":this.item.vehicleType,
        "item.description":this.item.description,
        "reqName":this.item.reqName,
        "reqId":this.item.reqId,
        "region":this.item.region,
        "reqEmail":this.item.reqEmail,
        "reqPhone":this.item.reqPhone,
        "supEmail":this.item.supEmail,
        "costCenter":this.item.costCenter,
        "projectNumber":this.item.projectNumber,
        "orderNumber":this.item.orderNumber,
        "locationPickup":this.item.locationPickup,
        "areaPickup":this.item.areaPickup,
        "addressPickup":this.item.addressPickup,
        "cityPickup":this.item.cityPickup,
        "statePickup":this.item.statePickup,
        "cepPickup":this.item.cepPickup,
        "datePickup":this.item.datePickup,
        "timePickup":this.item.timePickup,
        "locationDelivery":this.item.locationDelivery,
        "areaDelivery":this.item.areaDelivery,
        "dateDelivery":this.item.dateDelivery,
        "addressDelivery":this.item.addressDelivery,
        "cityDelivery":this.item.cityDelivery,
        "stateDelivery":this.item.stateDelivery,
        "cepDelivery":this.item.cepDelivery,
        "timeDelivery":this.item.timeDelivery,
       "notes":this.item.notes,
        "critical":this.item.critical,
        "dangerousProduct":this.item.dangerousProduct,
        "status":this.item.status,

      }


    }

    this.item.tableName = this.query


    // Remover as barras invertidas escapadas
    const itemsDataString = JSON.stringify(this.item); // Acessa a string desejada
    const modifiedString = itemsDataString.replace(/\\"/g, '"'); // Realiza a substituição na string


    // Converter a string JSON para um objeto JavaScript
    const jsonObject = JSON.parse(modifiedString) as { [key: string]: string };

    // Converter o objeto JavaScript de volta para uma string JSON
    const modifiedJsonString = JSON.stringify(jsonObject);

    console.log(modifiedJsonString);

    // Converter a string JSON para um objeto JavaScript
    const jsonObject2 = JSON.parse(modifiedJsonString) as { tableName: string, ID: string, acao: string };

    // Criar um array contendo o objeto
    const jsonArray = [jsonObject2];

    this.dynamodbService.salvar(jsonArray, this.query, this.urlAtualiza).subscribe(response => {

    }, error => {
      console.log(error);
    });
    this.dialogOpen = false;
    setTimeout(() => {
      this.getItemsFromDynamoDB();
    }, 200);
  }

  cancel(): void {
    this.dialogOpen = false;
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

              if (this.usuarioLogado.role == '3') {
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

