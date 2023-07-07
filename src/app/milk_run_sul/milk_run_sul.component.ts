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
import { FornecedoresFormDialogComponent } from '../app/home/fornecedores/fornecedores-form-dialog.component';



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

    for (const item of this.items) {
      // Verifica se 'fornecedor' está presente em this.fornecedores
      const fornecedorEncontrado = this.fornecedores.some(fornecedor => fornecedor['local'] === item['Fornecedor 2']);
      // Se fornecedorEncontrado for verdadeiro, significa que 'fornecedor' está presente
      if (fornecedorEncontrado) {
        // Adiciona a chave 'cadastrado' com o valor true ao objeto item
        item.cadastrado2 = true;
      } else {
        item.cadastrado2 = false;
      }
    }

    for (const item of this.items) {
      // Verifica se 'fornecedor' está presente em this.fornecedores
      const fornecedorEncontrado = this.fornecedores.some(fornecedor => fornecedor['local'] === item['Fornecedor 3']);
      // Se fornecedorEncontrado for verdadeiro, significa que 'fornecedor' está presente
      if (fornecedorEncontrado) {
        // Adiciona a chave 'cadastrado' com o valor true ao objeto item
        item.cadastrado3 = true;
      } else {
        item.cadastrado3 = false;
      }
    }

    for (const item of this.items) {
      // Verifica se 'fornecedor' está presente em this.fornecedores
      const fornecedorEncontrado = this.fornecedores.some(fornecedor => fornecedor['local'] === item['Fornecedor 4']);
      // Se fornecedorEncontrado for verdadeiro, significa que 'fornecedor' está presente
      if (fornecedorEncontrado) {
        // Adiciona a chave 'cadastrado' com o valor true ao objeto item
        item.cadastrado4 = true;
      } else {
        item.cadastrado4 = false;
      }
    }

    for (const item of this.items) {
      // Verifica se 'fornecedor' está presente em this.fornecedores
      const fornecedorEncontrado = this.fornecedores.some(fornecedor => fornecedor['local'] === item['Destino 1']);
      // Se fornecedorEncontrado for verdadeiro, significa que 'fornecedor' está presente
      if (fornecedorEncontrado) {
        // Adiciona a chave 'cadastrado' com o valor true ao objeto item
        item.cadastradoDestino1 = true;
      } else {
        item.cadastradoDestino1 = false;
      }
    }

    for (const item of this.items) {
      // Verifica se 'fornecedor' está presente em this.fornecedores
      const fornecedorEncontrado = this.fornecedores.some(fornecedor => fornecedor['local'] === item['Destino 2']);
      // Se fornecedorEncontrado for verdadeiro, significa que 'fornecedor' está presente
      if (fornecedorEncontrado) {
        // Adiciona a chave 'cadastrado' com o valor true ao objeto item
        item.cadastradoDestino2 = true;
      } else {
        item.cadastradoDestino2 = false;
      }
    }


    for (const item of this.items) {
      // Verifica se 'fornecedor' está presente em this.fornecedores
      const fornecedorEncontrado = this.fornecedores.some(fornecedor => fornecedor['local'] === item['Destino 3']);
      // Se fornecedorEncontrado for verdadeiro, significa que 'fornecedor' está presente
      if (fornecedorEncontrado) {
        // Adiciona a chave 'cadastrado' com o valor true ao objeto item
        item.cadastradoDestino3 = true;
      } else {
        item.cadastradoDestino3 = false;
      }
    }

    for (const item of this.items) {
      // Verifica se 'fornecedor' está presente em this.fornecedores
      const fornecedorEncontrado = this.fornecedores.some(fornecedor => fornecedor['local'] === item['Destino 4']);
      // Se fornecedorEncontrado for verdadeiro, significa que 'fornecedor' está presente
      if (fornecedorEncontrado) {
        // Adiciona a chave 'cadastrado' com o valor true ao objeto item
        item.cadastradoDestino4 = true;
      } else {
        item.cadastradoDestino4 = false;
      }
    }



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
              this.items = items
                .filter(item => item.description && item.description.toLowerCase().includes('sul'))
                .map(item => {
                  const date = new Date(item.date);
                  let janela1Date = date;

                  if (item['Janela 1']) {
                    const janela1 = item['Janela 1'];
                    const janela1Parts = janela1.split(':');
                    const hours = parseInt(janela1Parts[0], 10);
                    const minutes = parseInt(janela1Parts[1], 10);
                    janela1Date = new Date(item.date);
                    janela1Date.setHours(janela1Date.getHours() + hours);
                    janela1Date.setMinutes(janela1Date.getMinutes() + minutes);
                  }

                  let janela2Date = date;

                  if (item['Janela 2']) {
                    const janela2 = item['Janela 2'];
                    const janela2Parts = janela2.split(':');
                    const hours = parseInt(janela2Parts[0], 10);
                    const minutes = parseInt(janela2Parts[1], 10);
                    janela2Date = new Date(date);
                    janela2Date.setHours(janela2Date.getHours() + hours);
                    janela2Date.setMinutes(janela2Date.getMinutes() + minutes);
                  }

                  let janela3Date = date;

                  if (item['Janela 3']) {
                    const janela3 = item['Janela 3'];
                    const janela3Parts = janela3.split(':');
                    const hours = parseInt(janela3Parts[0], 10);
                    const minutes = parseInt(janela3Parts[1], 10);
                    janela3Date = new Date(date);
                    janela3Date.setHours(janela3Date.getHours() + hours);
                    janela3Date.setMinutes(janela3Date.getMinutes() + minutes);
                  }

                  let janela4Date = date;

                  if (item['Janela 4']) {
                    const janela4 = item['Janela 4'];
                    const janela4Parts = janela4.split(':');
                    const hours = parseInt(janela4Parts[0], 10);
                    const minutes = parseInt(janela4Parts[1], 10);
                    janela4Date = new Date(date);
                    janela4Date.setHours(janela4Date.getHours() + hours);
                    janela4Date.setMinutes(janela4Date.getMinutes() + minutes);
                  }

                  let janelaDestino1Date = date;

                  if (item['JanelaDestino 1']) {
                    const janelaDestino1 = item['JanelaDestino 1'];
                    const janelaDestino1Parts = janelaDestino1.split(':');
                    const hours = parseInt(janelaDestino1Parts[0], 10);
                    const minutes = parseInt(janelaDestino1Parts[1], 10);
                    janelaDestino1Date = new Date(date);
                    janelaDestino1Date.setHours(janelaDestino1Date.getHours() + hours);
                    janelaDestino1Date.setMinutes(janelaDestino1Date.getMinutes() + minutes);
                  }

                  let janelaDestino2Date = date;

                  if (item['JanelaDestino 2']) {
                    const janelaDestino2 = item['JanelaDestino 2'];
                    const janelaDestino2Parts = janelaDestino2.split(':');
                    const hours = parseInt(janelaDestino2Parts[0], 10);
                    const minutes = parseInt(janelaDestino2Parts[1], 10);
                    janelaDestino2Date = new Date(date);
                    janelaDestino2Date.setHours(janelaDestino2Date.getHours() + hours);
                    janelaDestino2Date.setMinutes(janelaDestino2Date.getMinutes() + minutes);
                  }

                  let janelaDestino3Date = date;

                  if (item['JanelaDestino 3']) {
                    const janela2 = item['JanelaDestino 3'];
                    const janela2Parts = janela2.split(':');
                    const hours = parseInt(janela2Parts[0], 10);
                    const minutes = parseInt(janela2Parts[1], 10);
                    janela2Date = new Date(date);
                    janela2Date.setHours(janela2Date.getHours() + hours);
                    janela2Date.setMinutes(janela2Date.getMinutes() + minutes);
                  }

                  // Repita o mesmo padrão para as outras chaves...

                  return {
                    ...item,
                    'Janela 1': janela1Date,
                    'Janela 2': janela2Date,
                    'Janela 3': janela3Date,
                    'Janela 4': janela4Date,
                    'JanelaDestino 1': janelaDestino1Date,
                    'JanelaDestino 2': janelaDestino2Date,
                    'JanelaDestino 3': janelaDestino3Date,
                    // Adicione as outras chaves aqui...
                    checked: false
                  };
                });
              // Filtra os itens que possuem a chave 'description' com a palavra 'sul'
              // (sem diferenciar maiúsculas de minúsculas), adiciona a chave 'checked' a cada item com valor inicial como false,
              // converte a chave 'date' em um objeto de data utilizando o construtor 'Date',
              // soma o valor das chaves 'Janela 1', 'Janela 2' e assim por diante à data do item e atualiza as respectivas chaves com os resultados
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

  editDialog(item: string): void {

const itemAlterado = { local: item };





    const dialogRef = this.dialog.open(FornecedoresFormDialogComponent, {
      data: {
        itemsData: itemAlterado,

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









