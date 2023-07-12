import { Component, OnInit } from '@angular/core';
import { isToday } from 'date-fns';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription, interval } from 'rxjs';
import { ApiService } from '../services/contratos/contratos.service';
import { AppModule } from '../app.module';
import { DevolverVazioFormDialogComponent } from '../app/home/devolver_vazio/devolver-vazio-form-dialog.component';
import { ContainerReuseFormDialogComponent } from '../app/home/container_reuse/container-reuse-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FornecedoresFormDialogComponent } from '../app/home/fornecedores/fornecedores-form-dialog.component';



@Component({
  selector: 'app-milk-run_sp',
  templateUrl: './milk-run-sp.component.html',
  styleUrls: ['./milk-run-sp.component.css']
})
export class MilkRunSPComponent implements OnInit {
  subscription: Subscription | undefined;
  items: any[] = [];
  itemsAntigo: any[] = [];
  fornecedores: any[] = [];
  posicao: any[] = [];
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
  informationMode!: boolean[];
  address!: string;
  DataAtual: Date = new Date();


  constructor(private dynamoDBService: ApiService, public dialog: MatDialog, private http: HttpClient) {
    this.editMode = [];
    this.informationMode = [];

  }

  ngOnInit() {

    this.getItemsFromDynamoDB();
    this.getFornecedoresFromDynamoDB();
    this.getPosicaoFromDynamoDB();
    setTimeout(() => {
      this.armazenarLatitudeEmItems();
    }, 1500);

    // Aguardar 1 segundo antes de chamar this.filtra()
    setTimeout(() => {
      this.filtra();
    }, 1500);


    this.subscription = interval(3 * 60 * 1000).subscribe(() => {
      // Chame a função que deseja executar a cada 3 minutos aqui
      this.getItemsFromDynamoDB();
      this.getFornecedoresFromDynamoDB();
      this.getPosicaoFromDynamoDB();
      setTimeout(() => {
        this.armazenarLatitudeEmItems();
      }, 1500);

      // Aguardar 1 segundo antes de chamar this.filtra()
      setTimeout(() => {
        this.filtra();
      }, 1500);
    });


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
  toggleInformationMode(index: number): void {
    this.informationMode[index] = !this.informationMode[index];
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

  getItemsFromDynamoDB(): void {
    const filtro = 'all';
    this.dynamoDBService.getItems(this.query, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.items = items
                .filter(item => item.description && item.description.toLowerCase().includes('progra'))
                .filter(item => item.Finalizada !== true) // Novo filtro adicionado
                .map(item => {

                  const date = new Date(item.date);
                  const janela1 = item['Janela 1'];
                  let janela1Date = janela1;

                  // Verifica se janela1 é uma data válida
                  if (!isNaN(Date.parse(janela1))) {

                  } else {
                    if (janela1 !== undefined) {
                      const janela1Parts = janela1.split(':');
                      const hours = parseInt(janela1Parts[0], 10);
                      const minutes = parseInt(janela1Parts[1], 10);
                      janela1Date = new Date(item.date);
                      janela1Date.setHours(janela1Date.getHours() + hours);
                      janela1Date.setMinutes(janela1Date.getMinutes() + minutes);
                    }

                  }

                  const janela2 = item['Janela 2'];
                  let janela2Date = janela2;

                  // Verifica se janela1 é uma data válida
                  if (!isNaN(Date.parse(janela2))) {

                  } else {
                    if (janela2 !== undefined) {
                      const janela2Parts = janela2.split(':');
                      const hours = parseInt(janela2Parts[0], 10);
                      const minutes = parseInt(janela2Parts[1], 10);
                      janela2Date = new Date(item.date);
                      janela2Date.setHours(janela2Date.getHours() + hours);
                      janela2Date.setMinutes(janela2Date.getMinutes() + minutes);

                    }

                  }

                  const janela3 = item['Janela 3'];
                  let janela3Date = janela3;

                  // Verifica se janela1 é uma data válida
                  if (!isNaN(Date.parse(janela3))) {

                  } else {
                    if (janela3 !== undefined) {
                      const janela3Parts = janela3.split(':');
                      const hours = parseInt(janela3Parts[0], 10);
                      const minutes = parseInt(janela3Parts[1], 10);
                      janela3Date = new Date(item.date);
                      janela3Date.setHours(janela3Date.getHours() + hours);
                      janela3Date.setMinutes(janela3Date.getMinutes() + minutes);
                    }

                  }

                  const janela4 = item['Janela 4'];
                  let janela4Date = janela4;

                  // Verifica se janela1 é uma data válida
                  if (!isNaN(Date.parse(janela4))) {

                  } else {
                    if (janela4 !== undefined) {
                      const janela4Parts = janela4.split(':');
                      const hours = parseInt(janela4Parts[0], 10);
                      const minutes = parseInt(janela4Parts[1], 10);
                      janela4Date = new Date(item.date);
                      janela4Date.setHours(janela4Date.getHours() + hours);
                      janela4Date.setMinutes(janela4Date.getMinutes() + minutes);
                    }

                  }

                  const janelaDestino1 = item['JanelaDestino 1'];
                  let janelaDestino1Date = janelaDestino1;

                  // Verifica se janela1 é uma data válida
                  if (!isNaN(Date.parse(janelaDestino1))) {

                  } else {
                    if (janelaDestino1 !== undefined) {
                      const janelaDestino1Parts = janelaDestino1.split(':');
                      const hours = parseInt(janelaDestino1Parts[0], 10);
                      const minutes = parseInt(janelaDestino1Parts[1], 10);
                      janelaDestino1Date = new Date(item.date);
                      janelaDestino1Date.setHours(janelaDestino1Date.getHours() + hours);
                      janelaDestino1Date.setMinutes(janelaDestino1Date.getMinutes() + minutes);
                    }
                  }

                  const janelaDestino2 = item['JanelaDestino 2'];
                  let janelaDestino2Date = janelaDestino2;

                  // Verifica se janela1 é uma data válida
                  if (!isNaN(Date.parse(janelaDestino2))) {

                  } else {
                    if (janelaDestino2 !== undefined) {
                      const janelaDestino2Parts = janelaDestino2.split(':');
                      const hours = parseInt(janelaDestino2Parts[0], 10);
                      const minutes = parseInt(janelaDestino2Parts[1], 10);
                      janelaDestino2Date = new Date(item.date);
                      janelaDestino2Date.setHours(janelaDestino2Date.getHours() + hours);
                      janelaDestino2Date.setMinutes(janelaDestino2Date.getMinutes() + minutes);
                    }

                  }

                  const janelaDestino3 = item['JanelaDestino 3'];
                  let janelaDestino3Date = janelaDestino3;

                  // Verifica se janela1 é uma data válida
                  if (!isNaN(Date.parse(janelaDestino3))) {

                  } else {
                    if (janelaDestino3 !== undefined) {
                      const janelaDestino3Parts = janelaDestino3.split(':');
                      const hours = parseInt(janelaDestino3Parts[0], 10);
                      const minutes = parseInt(janelaDestino3Parts[1], 10);
                      janelaDestino3Date = new Date(item.date);
                      janelaDestino3Date.setHours(janelaDestino3Date.getHours() + hours);
                      janelaDestino3Date.setMinutes(janelaDestino3Date.getMinutes() + minutes);
                    }
                  }

                  const janelaDestino4 = item['JanelaDestino 4'];
                  let janelaDestino4Date = janelaDestino4;

                  // Verifica se janela1 é uma data válida
                  if (!isNaN(Date.parse(janelaDestino4))) {

                  } else {
                    if (janelaDestino4 !== undefined) {
                      const janelaDestino4Parts = janelaDestino4.split(':');
                      const hours = parseInt(janelaDestino4Parts[0], 10);
                      const minutes = parseInt(janelaDestino4Parts[1], 10);
                      janelaDestino4Date = new Date(item.date);
                      janelaDestino4Date.setHours(janelaDestino4Date.getHours() + hours);
                      janelaDestino4Date.setMinutes(janelaDestino4Date.getMinutes() + minutes);
                    }
                  }

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

  getPosicaoFromDynamoDB(): void {
    const filtro = 'all';
    this.dynamoDBService.getItems(this.query2, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.posicao = items.map(item => ({ ...item, checked: false }));
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


  armazenarLatitudeEmItems() {

    for (let i = 0; i < this.items.length; i++) {
      const plate = this.items[i]['Plate'];
      const matchingPosicao = this.posicao.find(obj => obj['ID'] === plate);
      if (matchingPosicao) {
        this.items[i]['Latitude'] = matchingPosicao['Latitude'];
        this.items[i]['Longitude'] = matchingPosicao['Longitude'];
        this.items[i]['Endereco'] = matchingPosicao['Endereco'];
        this.items[i]['data_atualizacao'] = new Date(matchingPosicao['data_atualizacao']);
        this.items[i]['DataBordo'] = new Date(matchingPosicao['DataBordo']);

      }
      if (this.items[i]['DataBordo'] === undefined) {
        this.items[i]['Conexao'] = false;
      } else {
        this.DataAtual = new Date();
        var outraData = new Date(this.items[i]['DataBordo']);

        if (new Date(outraData.setHours(outraData.getHours() + 1)) > this.DataAtual) {
          this.items[i]['Conexao'] = true;
        } else {
          this.items[i]['Conexao'] = false;
        }
      }

    }
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
          this.ngOnInit();
        }, 1200); // Ajuste o tempo de atraso conforme necessário
      }
      console.log('The dialog was closed');
    });
  }



  acaoDeClique(item: any, NomePasso: string, NomeBotao: string, NomeDestino: string) {
    if (item[NomeBotao] === false) {
      // Executa ação 1
      this.editDialog(item[NomeDestino]);
    } else {
      // Executa ação 2
      this.finalizaPasso(NomePasso, item);
    }
  }

  finalizaPasso(Passo: string, item: any) {
    this.salvar(Passo, item);


    setTimeout(() => {
      this.ngOnInit();
    }, 1500);


  }

  salvar(Passo: String, item: any): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let body = [];
    if (Passo == 'Placa') {
      body = [{
        ...item, // Mantém as chaves existentes
        "ID": item.ID,
        "Plate": item.Plate,

        // Adicione outros campos conforme necessário
      }];

    } else {
      let ValorPasso = 0;
      let ContadorPasso = 0;
      switch (Passo) {
        case 'Passo Fornecedor1':
          ContadorPasso = ContadorPasso + 1;
          if (item['Janela 1'] > new Date()) {
            ValorPasso = 1;
          } else {
            ValorPasso = 2;
          }
          break;
        case 'Passo Fornecedor2':
          ContadorPasso = ContadorPasso + 1;
          if (item['Janela 2'] > new Date()) {
            ValorPasso = 1;
          } else {
            ValorPasso = 2;
          }
          break;
        case 'Passo Fornecedor3':
          ContadorPasso = ContadorPasso + 1;
          if (item['Janela 3'] > new Date()) {
            ValorPasso = 1;
          } else {
            ValorPasso = 2;
          }
          break;
        case 'Passo Fornecedor4':
          ContadorPasso = ContadorPasso + 1;
          if (item['Janela 4'] > new Date()) {
            ValorPasso = 1;
          } else {
            ValorPasso = 2;
          }
          break;
        case 'Passo Destino1':
          ContadorPasso = ContadorPasso + 1;
          if (item['JanelaDestino 1'] > new Date()) {
            ValorPasso = 1;
          } else {
            ValorPasso = 2;
          }
          break;
        case 'Passo Destino2':
          ContadorPasso = ContadorPasso + 1;
          if (item['JanelaDestino 2'] > new Date()) {
            ValorPasso = 1;
          } else {
            ValorPasso = 2;
          }
          break;
        case 'Passo Destino3':
          ContadorPasso = ContadorPasso + 1;
          if (item['JanelaDestino 3'] > new Date()) {
            ValorPasso = 1;
          } else {
            ValorPasso = 2;
          }
          break;
        case 'Passo Destino4':
          ContadorPasso = ContadorPasso + 1;
          if (item['JanelaDestino 4'] > new Date()) {
            ValorPasso = 1;
          } else {
            ValorPasso = 2;
          }
          break;

      }


      if (item['Passo Fornecedor1'] > 0) {
        ContadorPasso = ContadorPasso + 1;
      }
      if (item['Passo Fornecedor2'] > 0) {
        ContadorPasso = ContadorPasso + 1;
      }
      if (item['Passo Fornecedor3'] > 0) {
        ContadorPasso = ContadorPasso + 1;
      }
      if (item['Passo Fornecedor4'] > 0) {
        ContadorPasso = ContadorPasso + 1;
      }
      if (item['Passo Destino1'] > 0) {
        ContadorPasso = ContadorPasso + 1;
      }
      if (item['Passo Destino2'] > 0) {
        ContadorPasso = ContadorPasso + 1;
      }
      if (item['Passo Destino3'] > 0) {
        ContadorPasso = ContadorPasso + 1;
      }
      if (item['Passo Destino4'] > 0) {
        ContadorPasso = ContadorPasso + 1;
      }


      if (parseInt(item['Passos'], 10) === ContadorPasso) {
        body = [{
          ...item, // Mantém as chaves existentes
          "ID": item.ID,
          "Finalizada": true,


          [Passo.toString()]: ValorPasso,

          // Adicione outros campos conforme necessário
        }];

      } else {
        body = [{
          ...item, // Mantém as chaves existentes
          "ID": item.ID,


          [Passo.toString()]: ValorPasso,

          // Adicione outros campos conforme necessário
        }];
      }


    }

    this.dynamoDBService.salvar(body, this.query2, this.urlSalva).subscribe(response => {
      // Atualiza o item no banco de dados com sucesso
    }, error => {
      console.log(error);
      // Lidar com o erro ao atualizar o item no banco de dados
    });
  }


  getItemAntigo(item: any): number {
    for (let i = 0; i < this.itemsAntigo.length; i++) {
      if (this.itemsAntigo[i].ID === item.ID) {
        return i;
      }
    }
    return -1; // Retorna -1 se não encontrar correspondência
  }


}









