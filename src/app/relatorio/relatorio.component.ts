import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ApiService } from '../services/contratos/contratos.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { format } from 'date-fns';
import { ClrModal } from '@clr/angular';



@Component({
  selector: 'app-locais-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css'],
  styles: [`
    .mat-dialog-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background-color: #fff;
    }
  `]
})

export class RelatorioComponent {
  fieldBeingEdited!: string;
  editedValue: any;
  argentina!: any[];
  perfilVehicles: string[] = [
    'Pequeno',
    'Medio',
    'Grande',

  ];
  combustiveis: string[] = [
    'Diesel',
    'Gás',
    'Elétrico',

  ];
  item: any = {
    ID: '',
    local: '',
    contato: '',
    endereco: '',
    latitude: '',
    longitude: '',
    descarga: false
  };
  urlAtualiza: string = 'https://uj88w4ga9i.execute-api.sa-east-1.amazonaws.com/dev12';
  urlConsulta: string = 'https://4i6nb2mb07.execute-api.sa-east-1.amazonaws.com/dev13';
  query: string = 'Itens_Jetta';
  query2: string = 'Carriers';
  query3: string = 'tipos_Veiculos_Karrara';
  query4: string = 'items_Excel_Karrara';
  data: any;
  base: number = 3;
  ID: number = Date.now();
  local: string = "";
  contato: string = "";
  endereco: string = "";
  comentario: string = "";
  exponent: number = 22;
  $even: any;
  $odd: any;
  dataSource: any;
  dialogRef: any;
  items$!: Observable<any[]>;
  items: any[] = [];
  name!: string;
  animal!: string;
  dialogOpen = false;
  dialogTiposOpen = false;
  carrier!: any[];
  veiculos!: any[];
  teste!: boolean;
  startDate!: string;
  endDate!: string;
  milkRunSP: boolean = true;
  milkRunSul: boolean = true;
  milkRunArg: boolean = true;
  filteredItems!: any[];


  isDateInRange(date: Date, startDate: string, endDate: string): boolean {
    const rangeStartDate = new Date(startDate);
    const rangeEndDate = new Date(endDate);

    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth();
    const dateDay = date.getDate();

    return (
      date >= new Date(rangeStartDate.getFullYear(), rangeStartDate.getMonth(), rangeStartDate.getDate()) &&
      date <= new Date(rangeEndDate.getFullYear(), rangeEndDate.getMonth(), rangeEndDate.getDate(), 23, 59, 59, 999) &&
      dateYear === rangeStartDate.getFullYear() &&
      dateMonth === rangeStartDate.getMonth() &&
      dateDay === rangeStartDate.getDate()
    );
  }

  // ... Rest of your component code ...




  filterByDateRange(startDate: string, endDate: string): any[] {
    const rangeStartDate = new Date(startDate);
    const rangeEndDate = new Date(endDate);

    // Adjust rangeEndDate to the end of the selected day (23:59:59)
    rangeEndDate.setHours(23);
    rangeEndDate.setMinutes(59);
    rangeEndDate.setSeconds(59);

    const filteredItems = this.items.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= rangeStartDate && itemDate <= rangeEndDate;
    });

    const argentinaItems = this.argentina.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= rangeStartDate && itemDate <= rangeEndDate;
    });

    return [...filteredItems, ...argentinaItems];
  }


  editField(item: any, fieldName: string) {
    if (!this.isValorValido(item[fieldName])) {
      const newValue = prompt(`Insert a value for ${fieldName}:`);
      if (newValue !== null) {
        item[fieldName] = newValue;
        this.salvarField(item); // Call salvar function after editing the field
      }
    }
  }
  isValorValido(value: any): boolean {
    return value !== '' && value !== null && value !== undefined;
  }

  constructor(
    public dialog: MatDialog,
    private dynamodbService: ApiService,
    private http: HttpClient, private cdr: ChangeDetectorRef) {

  }

  editDialog(item: any): void {
    this.item.ID = item.ID
    this.item.local = item.local;
    this.item.contato = item.contato;
    this.item.endereco = item.endereco;
    this.item.latitude = item.latitude;
    this.item.longitude = item.longitude;
    this.item.descarga = item.descarga;
    this.dialogOpen = true;
  }

  valorExisteNoModelo(transportType: string): boolean {

    return this.veiculos.some(veiculos => veiculos.modelo === transportType);
  }

  applyDateFilter() {
    // Apply filter only when both startDate and endDate are selected
    if (this.startDate && this.endDate) {
      this.filteredItems = this.filterByDateRange(this.startDate, this.endDate);
    } else {
      // Otherwise, show all items
      this.filteredItems = [...this.items, ...this.argentina];
    }
  }


  veiculoDialog(item: any): void {
    this.item.ID = item.ID
    this.item.modelo = item['Transport Type'];
    this.item.transportadora = item.transportadora;
    this.item.perfil = item.perfil;
    this.item.combustivel = item.combustivel;
    this.item.emissoes = item.emissoes;
    this.dialogTiposOpen = true;
  }

  salvarVeiculo() {

    if (this.item.ID === undefined) {
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'ddMMyyyyHHmmss');
      console.log(formattedDate);

      this.item = {
        "ID": formattedDate.toString(),
      }


    }

    delete this.item.contato;
    delete this.item.descarga;
    delete this.item.endereco;
    delete this.item.latitude;
    delete this.item.longitude;
    delete this.item.local;

    this.item.tableName = this.query3


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

    this.dynamodbService.salvar(jsonArray, this.query3, this.urlAtualiza).subscribe(response => {

    }, error => {
      console.log(error);
    });
    this.dialogTiposOpen = false;
    setTimeout(() => {
      this.ngOnInit();
    }, 200);
  }

  salvarField(item: any) {

    // Criar um array contendo o objeto
    const jsonArray = [item];

    this.dynamodbService.salvar(jsonArray, this.query, this.urlAtualiza).subscribe(response => {
      // Successfully saved to the database
    }, error => {
      console.log(error);
    });

    this.dialogOpen = false;
    setTimeout(() => {
      this.getItemsFromDynamoDB();
    }, 200);
  }



  salvar() {

    if (this.item.ID === undefined) {
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'ddMMyyyyHHmmss');
      console.log(formattedDate);

      this.item = {
        "ID": formattedDate.toString(),
        "contato": this.item.contato,
        "endereco": this.item.endereco,
        "local": this.item.local,
        "latitude": this.item.latitude,
        "longitude": this.item.longitude,
        "descarga": this.item.descarga
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
    this.dialogTiposOpen = false;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.getItemsFromArgentina();
    this.getItemsFromDynamoDB();
    this.getCarriersFromDynamoDB();
    this.getVeiculosFromDynamoDB();

    setTimeout(() =>
      this.centerDialog()
      , 0);

    setTimeout(() =>
    this.filteredItems = this.items.concat(this.argentina)
      , 1500);


  }

  centerDialog(): void {
    const dialogRefElement = this.dialogRef?.containerInstance?.hostElement;
    if (dialogRefElement) {
      const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const dialogWidth = dialogRefElement.clientWidth;
      const dialogHeight = dialogRefElement.clientHeight;
      const top = Math.max(0, (windowHeight - dialogHeight) / 2);
      const left = Math.max(0, (windowWidth - dialogWidth) / 2);
      dialogRefElement.style.top = `${top}px`;
      dialogRefElement.style.left = `${left}px`;
    }
  }

  getItemsFromDynamoDB(): void {
    this.dynamodbService.getItems(this.query, this.urlConsulta, 'all').subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.items = items
                .filter(item => this.shouldIncludeItem(item))
                .map(item => ({ ...item, checked: false }));
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

  shouldIncludeItem(item: any): boolean {
    const description = item.description ? item.description.toLowerCase() : '';
    if (this.milkRunSP && description.includes('prog')) {
      return true;
    }
    if (this.milkRunSul && (description.includes('sul') || description.includes('tcm'))) {
      return true;
    }
    return false;
  }
  getVeiculosFromDynamoDB(): void {
    const filtro = 'all';
    this.dynamodbService.getItems(this.query3, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.veiculos = items.map(item => ({ ...item, checked: false }));
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

  getItemsFromArgentina(): void {
    this.dynamodbService.getItems(this.query4, this.urlConsulta, 'all').subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.argentina = items
                .filter(item => this.shouldIncludeArgentina(item))
                .map(item => ({ ...item, checked: false }));
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

  shouldIncludeArgentina(item: any): boolean {
    const description = item.description ? item.description.toLowerCase() : '';
    if (this.milkRunArg && description.includes('arg')) {
      return true;
    }
    return false;
  }


  getCarriersFromDynamoDB(): void {
    const filtro = 'all';
    this.dynamodbService.getItems(this.query2, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.carrier = items.map(item => ({ ...item, checked: false }));
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


  deleteItem(Item: any, urlDeleta: string, query: string): void {

    const ID = Item.ID;
    this.dynamodbService.deleteItem(ID, this.urlAtualiza, Item.tableName).subscribe(
      response => {
        setTimeout(() => {
          this.ngOnInit();
        }, 1200); // Ajuste o tempo de atraso conforme necessário
      },
      error => {
        // Lógica para lidar com erros durante a deleção do item
      }
    );

  }

  milkRunSPFilter() {
    if (this.milkRunSP === true) {
      this.milkRunSP = false;
    } else {
      this.milkRunSP = true;
    }

    setTimeout(() => {
      this.ngOnInit();
    }, 200);

  }
  milkRunSulFilter() {
    if (this.milkRunSul === true) {
      this.milkRunSul = false;

    } else {
      this.milkRunSul = true;

    }
    setTimeout(() => {
      this.ngOnInit();
    }, 200);

  }
  milkRunArgFilter() {

    if (this.milkRunArg === true) {
      this.milkRunArg = false;
    } else {
      this.milkRunArg = true;
    }
    setTimeout(() => {
      this.ngOnInit();
    }, 200);
  }

}
