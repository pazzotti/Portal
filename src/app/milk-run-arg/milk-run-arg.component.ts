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
  selector: 'app-milk-run_arg',
  templateUrl: './milk-run-arg.component.html',
  styleUrls: ['./milk-run-arg.component.css']
})
export class MilkRunARGComponent implements OnInit {
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
  query: string = 'items_Excel_Karrara';
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
                .filter(item => item.description && item.description.toLowerCase().includes('arg'))
                .filter(item => item.Finalizada !== true)
                .map(item => {
                  const date = new Date(item.date);
                  let janela1Date = null;

                  return {
                    ...item,
                    'Janela 1': item['Janela 1'],
                    'Janela 2': item['Janela 2'],
                    'Janela 3': item['Janela 3'],
                    'Janela 4': item['Janela 4'],
                    'JanelaDestino 1': item['JanelaDestino 1'],
                    'JanelaDestino 2': item['JanelaDestino 2'],
                    'JanelaDestino 3': item['JanelaDestino 3'],
                    'JanelaDestino 4': item['JanelaDestino 4'],
                    // Adicione as outras chaves aqui...
                    checked: false
                  };
                });
              // Restante do código...
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
