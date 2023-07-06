import { Component, OnInit } from '@angular/core';
import { isToday } from 'date-fns';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { ApiService } from '../services/contratos/contratos.service';
import { AppModule } from '../app.module';
import { DevolverVazioFormDialogComponent } from '../app/home/devolver_vazio/devolver-vazio-form-dialog.component';
import { ContainerReuseFormDialogComponent } from '../app/home/container_reuse/container-reuse-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-milk_run_sul',
  templateUrl: './milk_run_sul.component.html',
  styleUrls: ['./milk_run_sul.component.css']
})
export class MilkRunSulComponent implements OnInit {
  items: any[] = [];
  fornecedores: any[] = [];
  sortColumn: string = '';
  sortNumber: number = 0;
  sortDirection: number = 1;
  dataLoaded = true;
  filtroDataInicio: Date = new Date();
  filtroDataTermino: Date = new Date();
  itemsFiltrados: any[] = [];
  searchText: string = '';
  items2: any[] = [ /* Seus itens aqui */];
  private searchTextSubject = new Subject<string>();
  private searchTextSubscription!: Subscription;
  urlConsulta: string = 'https://4i6nb2mb07.execute-api.sa-east-1.amazonaws.com/dev13';
  urlSalva: string = 'https://uj88w4ga9i.execute-api.sa-east-1.amazonaws.com/dev12';
  query: string = 'Itens_Jetta';
  query2: string = 'Porta_Rastreando_JSL';
  query3: string = 'Fornecedores_Karrara_Transport';
  data: any;
  editMode!: boolean[];


  constructor(private dynamoDBService: ApiService, public dialog: MatDialog, private http: HttpClient) {
    this.editMode = [];
  }

  ngOnInit() {
    this.searchTextSubscription = this.searchTextSubject.pipe(debounceTime(300)).subscribe(() => {
      this.filterItems();
    });
    this.getItemsFromDynamoDB();
    this.getFornecedoresFromDynamoDB();

    // Aguardar 1 segundo antes de chamar this.filtra()
    setTimeout(() => {
      this.filtra();
    }, 1000);
  }


  filtra() {
    for (const item of this.items) {
      // Verifica se 'fornecedor' está presente em this.fornecedores
      const fornecedorEncontrado = this.fornecedores.some(fornecedor => fornecedor['local'] === item['Fornecedor 1']);

      // Se fornecedorEncontrado for verdadeiro, significa que 'fornecedor' está presente
      if (fornecedorEncontrado) {
        // Adiciona a chave 'cadastrado' com o valor true ao objeto item
        item.cadastrado1 = true;
      } else {
        item.cadastrado1 = false;
      }
    }
    console.log(this.items);

  }

  toggleEditMode(index: number): void {
    this.editMode[index] = !this.editMode[index];
  }


  getFornecedorKeyByIndex(item: any, index: number): string {
    const fornecedorKeys = this.getKeysByPrefix(item, 'Fornecedor');
    return fornecedorKeys[index - 1];
  }

  getDestinoKeyByIndex(item: any, index: number): string {
    const destinoKeys = this.getKeysByPrefix(item, 'Destino');
    return destinoKeys[index - 1];
  }

  getKeysByPrefix(obj: any, prefix: string): string[] {
    return Object.keys(obj).filter(key => key.startsWith(prefix));
  }

  devolverVazio(item: Array<any>, url: string, table: string): void {
    const dialogRef = this.dialog.open(DevolverVazioFormDialogComponent, {
      data: {
        itemsData: item,
        url: url,
        query: table
      },
      height: '350px',
      minWidth: '450px',
      position: {
        top: '10vh',
        left: '30vw'
      },


    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        setTimeout(() => {
          this.getItemsFromDynamoDB();
        }, 700); // Ajuste o tempo de atraso conforme necessário
      }

    });
  }

  reutilizar(item: Array<any>, url: string, table: string): void {
    const dialogRef = this.dialog.open(ContainerReuseFormDialogComponent, {
      data: {
        itemsData: item,
        url: url,
        query: table
      },
      height: '350px',
      minWidth: '750px',
      position: {
        top: '10vh',
        left: '30vw'
      },


    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        setTimeout(() => {
          this.getItemsFromDynamoDB();
        }, 700); // Ajuste o tempo de atraso conforme necessário
      }

    });
  }

  ngOnDestroy() {
    this.searchTextSubscription.unsubscribe();
  }

  converterData(stringData: string): string {
    const partes = stringData.split('/');
    const dia = partes[0];
    const mes = partes[1];
    const ano = partes[2];

    return `${ano}-${mes}-${dia}`;
  }

  aplicarFiltroPorData(): void {
    if (this.filtroDataInicio && this.filtroDataTermino) {
      const filtroInicio = new Date(this.filtroDataInicio);
      const filtroTermino = new Date(this.filtroDataTermino);

      this.itemsFiltrados = this.items.filter(item => {
        const dataFormatada = this.converterData(item.ATA);
        const dataItem = new Date(dataFormatada);

        return dataItem >= filtroInicio && dataItem <= filtroTermino;
      });
    } else {
      this.itemsFiltrados = this.items;
    }
  }

  calcularSomaTrip(): number {
    return this.itemsFiltrados.reduce((sum, item) => sum + Number(item.TripCost), 0);
  }
  calcularSomaHandling(): number {
    return this.itemsFiltrados.reduce((sum, item) => sum + Number(item.Handling), 0);
  }
  calcularSomaDemurrage(): number {
    return this.itemsFiltrados.reduce((sum, item) => sum + Number(item.Demurrage), 0);
  }

  getItemsFromDynamoDB(): void {
    const filtro = 'all';
    this.dynamoDBService.getItems(this.query, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.items = items.map(item => ({ ...item, checked: false }));
              // Adiciona a chave 'checked' a cada item, com valor inicial como false
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

  getFornecedoresFromDynamoDB(): void {
    const filtro = 'all';
    this.dynamoDBService.getItems(this.query3, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.fornecedores = items.map(item => ({ ...item, checked: false }));
              // Adiciona a chave 'checked' a cada item, com valor inicial como false
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



  sortBy(column: string) {
    if (this.sortColumn === column) {
      // Reverse the sort direction
      this.sortDirection *= -1;
    } else {
      // Set the new sort column and reset the sort direction
      this.sortColumn = column;
      this.sortDirection = 1;
    }

    // Sort the data array based on the selected column and direction
    this.itemsFiltrados.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
      const valueA = a[this.sortColumn];
      const valueB = b[this.sortColumn];

      if (valueA < valueB) {
        return -1 * this.sortDirection;
      } else if (valueA > valueB) {
        return 1 * this.sortDirection;
      } else {
        return 0;
      }
    });
  }
  sortBy2(column: string) {
    if (this.sortColumn === column) {
      // Reverse the sort direction
      this.sortDirection *= -1;
    } else {
      // Set the new sort column and reset the sort direction
      this.sortColumn = column;
      this.sortDirection = 1;
    }

    // Sort the data array based on the selected column and direction
    this.itemsFiltrados.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
      const valueA = parseFloat(a[this.sortColumn]);
      const valueB = parseFloat(b[this.sortColumn]);

      if (valueA < valueB) {
        return -1 * this.sortDirection;
      } else if (valueA > valueB) {
        return 1 * this.sortDirection;
      } else {
        return 0;
      }
    });
  }
  sortByDate(column: string) {
    if (this.sortColumn === column) {
      // Inverte a direção da ordenação
      this.sortDirection *= -1;
    } else {
      // Define a nova coluna de ordenação e redefine a direção da ordenação
      this.sortColumn = column;
      this.sortDirection = 1;
    }

    // Sort the data array based on the selected column and direction
    this.itemsFiltrados.sort((a: { [x: string]: any; }, b: { [x: string]: any; }) => {
      const dateA = this.parseDate(a[this.sortColumn]);
      const dateB = this.parseDate(b[this.sortColumn]);

      if (dateA < dateB) {
        return -1 * this.sortDirection;
      } else if (dateA > dateB) {
        return 1 * this.sortDirection;
      } else {
        return 0;
      }
    });
  }

  parseDate(dateString: string): Date {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }


  filterItems() {
    const searchText = this.searchText.toLowerCase();
    this.itemsFiltrados = this.items.filter(item => {

      // Implemente a lógica de filtragem com base no seu HTML
      // Por exemplo, se seus itens tiverem uma propriedade 'Process':
      return item.Process.toLowerCase().includes(searchText)
        || item.Invoice.toLowerCase().includes(searchText)
        || item.Container.toLowerCase().includes(searchText)
        || item.Step.toLowerCase().includes(searchText)
        || item.Liner.toLowerCase().includes(searchText)
        || item.Channel.toLowerCase().includes(searchText)
        || item.ATA.toLowerCase().includes(searchText)
        || item.Dias.toLowerCase().includes(searchText)
        || item.FreeTime.toLowerCase().includes(searchText)
        || item.TripCost.toLowerCase().includes(searchText)
        || item.Handling.toLowerCase().includes(searchText)
        || item.Demurrage.toLowerCase().includes(searchText);
    });
  }

  onSearchTextChanged() {
    this.searchTextSubject.next(this.searchText);
  }

  salvar(item: any): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = [{
      ...item, // Mantém as chaves existentes
      'Transport Type': item['Transport Type'],
      'Plate': item['Plate'],
      'Fornecedor 1': item['Fornecedor 1'],
      'Janela 1': item['Janela 1'],
      'Destino 1': item['Destino 1'],
      'JanelaDestino 1': item['JanelaDestino 1'],
      'tableName': this.query
      // Adicione outros campos conforme necessário
    }];

    this.dynamoDBService.salvar(body, this.query2, this.urlSalva).subscribe(response => {
      // Atualiza o item no banco de dados com sucesso
    }, error => {
      console.log(error);
      // Lidar com o erro ao atualizar o item no banco de dados
    });
  }


}









