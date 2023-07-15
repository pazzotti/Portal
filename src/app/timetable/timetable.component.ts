import { CarregaService } from '../services/carrega_file/carrega.service';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { format, parse, differenceInDays, addHours } from 'date-fns';
import { ApiService } from '../services/contratos/contratos.service';
import { map, take } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { EditaFormDialogComponent } from '../app/home/edita_timetable/edita_timetable-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';




@Component({
  selector: 'timetable-root',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css'],
  template: `
    <progressbar [value]="progressValue" [max]="100">{{ progressValue }}%</progressbar>
  `
})
export class TimeTableComponent {
  progressValue = 0; // Valor atual da barra de progresso
  maxValue = 0; // Valor máximo da barra de progresso
  showProgressBar = false;
  @ViewChild('downloadLink') downloadLink!: ElementRef<HTMLAnchorElement>;
  urlAtualiza: string = 'https://uj88w4ga9i.execute-api.sa-east-1.amazonaws.com/dev12';
  urlConsulta: string = 'https://4i6nb2mb07.execute-api.sa-east-1.amazonaws.com/dev13';
  query: string = 'itens_Interplantas_Karrara';
  query2: string = 'Operacao_Interplantas_Karrara';
  items$: Observable<any> | undefined;
  dataLoaded = false;
  jsonData: any;
  sortColumn: string = '';
  sortDirection: number = 1;
  dias_terminal: Date = new Date();
  Freetime: number = 0;
  dados: any[] = [];
  contratos: string[] = [];
  freetime: string[] = [];
  tripcost: string[] = [];
  custoViagem: string = "";
  handling: string[] = [];
  manuseio: string = "";
  demurrage: string[] = [];
  estadia: string = "";
  valorFree: string = '';
  liner: string = "";
  vessel: string = "";
  custoestadia: number = 0;
  startDate!: Date;
  endDate: Date = new Date();
  editMode!: boolean[];
  informationMode!: boolean[];
  programacao: any[] = [];

  constructor(
    private carregaService: CarregaService,
    private http: HttpClient,
    private dynamodbService: ApiService,
    public dialog: MatDialog,
    private datePipe: DatePipe

  ) { }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    const fileBlob = await fetch(fileUrl).then(response => response.blob());
    const rawData = await this.carregaService.loadFile(fileBlob);
    const inflatedData = this.inflateData(rawData); // Inflar os campos desejados
    this.jsonData = inflatedData;
    this.dataLoaded = true;
    // Chama a função para salvar os dados no API Gateway
  }



  getProgramacaoFromDynamoDB(): void {
    const filtro = 'all';
    this.dynamodbService.getItems(this.query, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.programacao = items.map(item => ({ ...item, checked: false }));
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


  salvarNoBanco() {
    this.showProgressBar = true;
    console.log('Item a ser salvo:', this.jsonData);
    this.progressValue = 0;
    this.maxValue = this.jsonData.length;
    const batchSize = 10; // Defina o tamanho máximo para cada lote
    const batches = this.chunkArray(this.jsonData, batchSize); // Fraciona o jsonData em lotes menores

    for (const batch of batches) {
      // Acrescentar o campo "lastupdate" com o valor da data de hoje
      const currentDate = new Date();
      const formattedDate = currentDate.getDate().toString().padStart(2, '0') +
        (currentDate.getMonth() + 1).toString().padStart(2, '0') +
        currentDate.getFullYear().toString();
      for (const item of batch) {
        item.lastupdate = formattedDate;
      }

      this.dynamodbService.salvar(batch, this.query, this.urlAtualiza).subscribe(
        response => {
          this.progressValue = this.progressValue + batch.length;
          console.log('Resposta do salvamento:', response);
        },
        error => {
          console.error('Erro ao salvar:', error);
        }
      );
    }

    setTimeout(() => {
      this.showProgressBar = false;
    }, 7000); // Defina o tempo adequado conforme necessário
  }

  toggleEditMode(index: number): void {
    this.editMode[index] = !this.editMode[index];
  }
  toggleInformationMode(index: number): void {
    this.informationMode[index] = !this.informationMode[index];
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
    this.salvarNoBanco();


    setTimeout(() => {
      this.ngOnInit();
    }, 1500);


  }

  openDialog(item: any): void {
    const horaMinuto1 = this.datePipe.transform(item['Janela 1'], 'HH:mm');
    const horaMinuto2 = this.datePipe.transform(item['Janela 2'], 'HH:mm');
    const horaMinuto3 = this.datePipe.transform(item['Janela 3'], 'HH:mm');
    const horaMinuto4 = this.datePipe.transform(item['Janela 4'], 'HH:mm');
    const horaMinuto5 = this.datePipe.transform(item['Janela 5'], 'HH:mm');
    const horaMinuto6 = this.datePipe.transform(item['Janela 6'], 'HH:mm');


    item = {
      "ID": undefined,
      "Transportadora": undefined,
      "Plate": undefined,
      "Viagem": undefined,
      "Local 1": undefined,
      "Local 2": undefined,
      "Local 3": undefined,
      "Local 4": undefined,
      "Local 5": undefined,
      "Local 6": undefined,
      "Janela 1": undefined,
      "Janela 2": undefined,
      "Janela 3": undefined,
      "Janela 4": undefined,
      "Janela 5": undefined,
      "Janela 6": undefined,
      "tableName": this.query
    }



    const itemAlterado = { local: item };
    const dialogRef = this.dialog.open(EditaFormDialogComponent, {
      data: {
        query:'itens_Interplantas_Karrara',
        itemsData: itemAlterado,
        janela1: horaMinuto1,
        janela2: horaMinuto2,
        janela3: horaMinuto3,
        janela4: horaMinuto4,
        janela5: horaMinuto5,
        janela6: horaMinuto6,

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

  editDialog(item: any): void {
    const horaMinuto1 = this.datePipe.transform(item['Janela 1'], 'HH:mm');
    const horaMinuto2 = this.datePipe.transform(item['Janela 2'], 'HH:mm');
    const horaMinuto3 = this.datePipe.transform(item['Janela 3'], 'HH:mm');
    const horaMinuto4 = this.datePipe.transform(item['Janela 4'], 'HH:mm');
    const horaMinuto5 = this.datePipe.transform(item['Janela 5'], 'HH:mm');
    const horaMinuto6 = this.datePipe.transform(item['Janela 6'], 'HH:mm');

    const itemAlterado = { local: item };
    const dialogRef = this.dialog.open(EditaFormDialogComponent, {
      data: {
        query:'itens_Interplantas_Karrara',
        itemsData: itemAlterado,
        janela1: horaMinuto1,
        janela2: horaMinuto2,
        janela3: horaMinuto3,
        janela4: horaMinuto4,
        janela5: horaMinuto5,
        janela6: horaMinuto6,

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


  chunkArray(array: any[], size: number): any[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }


  salvar() {

    if (this.startDate === undefined) {
      alert('Selecione a data');
      return; // Retorna imediatamente para interromper a execução da função
    }



    const currentDate = new Date();

    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const formattedDate = currentDate.getDate().toString().padStart(2, '0') +
      (currentDate.getMonth() + 1).toString().padStart(2, '0') +
      totalSeconds.toString() +
      currentDate.getFullYear().toString();


    const data = new Date(this.startDate);
    data.setHours(data.getHours() + 3);
    let i = 0;
    this.programacao.forEach(objeto => {
      let dateString = objeto['Janela 1'];  // Acessar a propriedade 'Janela 1' do objeto
      let date = new Date(dateString);
      let hours = ('0' + date.getHours()).slice(-2);
      let minutes = ('0' + date.getMinutes()).slice(-2);
      let seconds = ('0' + date.getSeconds()).slice(-2);
      const timeString1 = hours + ':' + minutes + ':' + seconds;
      const janela1 = this.carregaService.naoadicionarHora(timeString1, new Date(data));

      dateString = objeto['Janela 2'];
      date = new Date(dateString);
      hours = ('0' + date.getHours()).slice(-2);
      minutes = ('0' + date.getMinutes()).slice(-2);
      seconds = ('0' + date.getSeconds()).slice(-2);
      const timeString2 = hours + ':' + minutes + ':' + seconds;
      const janela2 = this.carregaService.naoadicionarHora(timeString2, new Date(data));

      dateString = objeto['Janela 3'];
      date = new Date(dateString);
      hours = ('0' + date.getHours()).slice(-2);
      minutes = ('0' + date.getMinutes()).slice(-2);
      seconds = ('0' + date.getSeconds()).slice(-2);
      const timeString3 = hours + ':' + minutes + ':' + seconds;
      const janela3 = this.carregaService.naoadicionarHora(timeString3, new Date(data));

      dateString = objeto['Janela 4'];
      date = new Date(dateString);
      hours = ('0' + date.getHours()).slice(-2);
      minutes = ('0' + date.getMinutes()).slice(-2);
      seconds = ('0' + date.getSeconds()).slice(-2);
      const timeString4 = hours + ':' + minutes + ':' + seconds;
      const janela4 = this.carregaService.naoadicionarHora(timeString4, new Date(data));

      dateString = objeto['Janela 5'];
      date = new Date(dateString);
      hours = ('0' + date.getHours()).slice(-2);
      minutes = ('0' + date.getMinutes()).slice(-2);
      seconds = ('0' + date.getSeconds()).slice(-2);
      const timeString5 = hours + ':' + minutes + ':' + seconds;
      const janela5 = this.carregaService.naoadicionarHora(timeString5, new Date(data));

      dateString = objeto['Janela 6'];
      date = new Date(dateString);
      hours = ('0' + date.getHours()).slice(-2);
      minutes = ('0' + date.getMinutes()).slice(-2);
      seconds = ('0' + date.getSeconds()).slice(-2);
      const timeString6 = hours + ':' + minutes + ':' + seconds;
      const janela6 = this.carregaService.naoadicionarHora(timeString6, new Date(data));
      objeto.ID = formattedDate + i;
      objeto.tableName = 'Operacao_Interplantas_Karrara';
      objeto['Janela 1'] = janela1;
      objeto['Janela 2'] = janela2;
      objeto['Janela 3'] = janela3;
      objeto['Janela 4'] = janela4;
      objeto['Janela 5'] = janela5;
      objeto['Janela 6'] = janela6;
      i++;
    });


    // Atualizando o array se necessário (opcional)
    this.programacao = [...this.programacao];

    // Remover as barras invertidas escapadas
    const itemsDataString = JSON.stringify(this.programacao); // Acessa a string desejada
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

    this.dynamodbService.salvar(jsonObject2, this.query2, this.urlAtualiza).subscribe(response => {

    }, error => {
      console.log(error);
    });

    this.getProgramacaoFromDynamoDB();
    alert('Concluído com sucesso');

  }




  ngOnInit() {

    this.getProgramacaoFromDynamoDB();
    const filtro = '';

    console.log(this.programacao);


  }



  testarArquivo(arquivo: File): void {
    this.carregaService.testarArquivoCSV(arquivo).then((estaCorreto) => {
      if (estaCorreto) {
        console.log('O arquivo CSV está correto.');
      } else {
        console.log('O arquivo CSV está incorreto.');
      }
    }).catch((erro) => {
      console.error('Erro ao testar o arquivo CSV:', erro);
    });
  }

  inflateData(rawData: any[]): any[] {
    let i = 0;
    return rawData.map((item: any) => {

      const hora1 = item[3];
      const janela1 = this.carregaService.formatHora(item[3], this.startDate);
      const janela2 = this.carregaService.formatHora(item[5], this.startDate);
      const janela3 = this.carregaService.formatHora(item[7], this.startDate);
      const janela4 = this.carregaService.formatHora(item[9], this.startDate);
      const janela5 = this.carregaService.formatHora(item[11], this.startDate);
      const janela6 = this.carregaService.formatHora(item[13], this.startDate);

      const currentDate = new Date();
      const formattedDate = format(currentDate, 'ddMMyyyyHHmmss') + i;
      i = i + 1;

      const inflatedItem: any = {
        'tableName': this.query,
        'ID': formattedDate.toString(),
        'Transportadora': item[0],
        'Viagem': item[1],
        'Plate': item[2],
        'Janela 1': new Date(janela1),
        'Janela 2': new Date(janela2),
        'Janela 3': new Date(janela3),
        'Janela 4': new Date(janela4),
        'Janela 5': new Date(janela5),
        'Janela 6': new Date(janela6),
        'Local 1': item[4],
        'Local 2': item[6],
        'Local 3': item[8],
        'Local 4': item[10],
        'Local 5': item[12],
        'Local 6': item[14]
        // Adicione mais campos conforme necessário
      };
      return inflatedItem;
    });

  }

  deleteItem(ID: string): void {
    this.dynamodbService.deleteItem(ID, this.urlAtualiza, this.query).subscribe(
      response => {
        setTimeout(() => {
          this.getProgramacaoFromDynamoDB();
        }, 400); // Ajuste o tempo de atraso conforme necessário
      },
      error => {
        // Lógica para lidar com erros durante a deleção do item
      }
    );

  }

}
