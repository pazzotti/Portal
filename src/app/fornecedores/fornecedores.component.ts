import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/contratos/contratos.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FornecedoresFormDialogComponent } from '../app/home/fornecedores/fornecedores-form-dialog.component';
import { Observable, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { format } from 'date-fns';


@Component({
  selector: 'app-locais-fornecedores',
  templateUrl: './fornecedores.component.html',
  styleUrls: ['./fornecedores.component.css'],
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

export class FornecedoresComponent {
  urlAtualiza: string = 'https://uj88w4ga9i.execute-api.sa-east-1.amazonaws.com/dev12';
  urlConsulta: string = 'https://4i6nb2mb07.execute-api.sa-east-1.amazonaws.com/dev13';
  query: string = 'Fornecedores_Karrara_Transport';
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
  constructor(
    public dialog: MatDialog,
    private dynamodbService: ApiService,
    private http: HttpClient, private cdr: ChangeDetectorRef) {

  }

  editDialog(item: Array<any>, url: string, table: string): void {
    const dialogRef = this.dialog.open(FornecedoresFormDialogComponent, {
      data: {
        itemsData: item,
        url: url,
        query: table
      },
      width: '850px', // Defina a largura desejada em pixels ou porcentagem
      height: '550px',
      position: {
        top: '1vh',
        left: '30vw'
      },
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        setTimeout(() => {
          this.getItemsFromDynamoDB();
        }, 200); // Ajuste o tempo de atraso conforme necessário
      }
      console.log('The dialog was closed');
    });
  }

  openDialog(item: Array<any>, url: string, table: string): void {
    const dialogRef = this.dialog.open(FornecedoresFormDialogComponent, {
      data: {
        itemsData: [],
        url: url,
        query: table
      },
      width: '850px', // Defina a largura desejada em pixels ou porcentagem
      height: '550px',
      position: {
        top: '1vh',
        left: '30vw'
      },
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        setTimeout(() => {
          this.getItemsFromDynamoDB();
        }, 200); // Ajuste o tempo de atraso conforme necessário
      }
      console.log('The dialog was closed');
    });
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

  getItemsFromDynamoDB(): void {
    const filtro = 'all';
    this.dynamodbService.getItems(this.query, this.urlConsulta, filtro).subscribe(
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
