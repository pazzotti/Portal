import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/contratos/contratos.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VeiculosFormDialogComponent } from '../app/home/veiculos/veiculos-form-dialog.component';
import { Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { format } from 'date-fns';


@Component({
  selector: 'app-veiculos-lab',
  templateUrl: './veiculos-lab.component.html',
  styleUrls: ['./veiculos-lab.component.css'],
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

export class VeiculosLabComponent {
  item: any = {
    ID: '',
    modelo: '',
    placa: '',
    chassis: '',
    vincode: '',
    fabricacao: ''
  };
  urlAtualiza: string = 'https://uj88w4ga9i.execute-api.sa-east-1.amazonaws.com/dev12';
  urlConsulta: string = 'https://4i6nb2mb07.execute-api.sa-east-1.amazonaws.com/dev13';
  query: string = 'veiculos_lab_Karrara';
  data: any;
  base: number = 3;
  ID: number = Date.now();
  $even: any;
  $odd: any;
  dataSource: any;
  dialogRef: any;
  items$!: Observable<any[]>;
  items: any[] = [];
  name!: string;
  animal!: string;
  dialogOpen!: boolean;
  constructor(
    public dialog: MatDialog,
    private dynamodbService: ApiService,
    private http: HttpClient, private cdr: ChangeDetectorRef) {

  }

  editDialog(item: any): void {
    this.item.ID = item.ID
    this.item.modelo = item.modelo;
    this.item.placa = item.placa;
    this.item.chassis = item.chassis;
    this.item.vincode = item.vincode;
    this.item.fabricacao = item.fabricacao;
    this.dialogOpen = true;
  }

  salvar() {

    if (this.item.ID === undefined) {
      const currentDate = new Date();
      const formattedDate = format(currentDate, 'ddMMyyyyHHmmss');
      console.log(formattedDate);

      this.item = {
        "ID": formattedDate.toString(),
        "modelo": this.item.modelo,
        "placa": this.item.placa,
        "chassis": this.item.chassis,
        "vincode": this.item.vincode,
        "fabricacao": this.item.fabricacao
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
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.getItemsFromDynamoDB();
    setTimeout(() => this.centerDialog(), 0);
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

  async getItemsFromDynamoDB(): Promise<void> {
    const filtro = 'all';
    (await this.dynamodbService.getItems(this.query, this.urlConsulta, filtro)).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.items = items.map(item => ({ ...item, checked: false }));
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
        }, 200); // Ajuste o tempo de atraso conforme necessário
      },
      error => {
        // Lógica para lidar com erros durante a deleção do item
      }
    );

  }

}
