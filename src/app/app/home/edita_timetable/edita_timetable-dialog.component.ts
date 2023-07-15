import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/contratos/contratos.service';
import { format } from 'date-fns';
import { AppModule } from 'src/app/app.module';
import { CarregaService } from 'src/app/services/carrega_file/carrega.service';





@Component({
  selector: 'app-edita_timetable-dialog',
  templateUrl: './edita_timetable-dialog.component.html',
  styleUrls: ['./edita_timetable-dialog.component.css']
})
export class EditaFormDialogComponent {

  base: number = 3;
  ID: number = Date.now();
  local: string = "";
  cor: string = "";
  descricao: string = "";
  exponent: number = 22;
  dataSource: any;
  urlAtualiza: string = 'https://uj88w4ga9i.execute-api.sa-east-1.amazonaws.com/dev12';
  urlConsulta: string = 'https://4i6nb2mb07.execute-api.sa-east-1.amazonaws.com/dev13';
  query: string = 'itens_Interplantas_Karrara';
  query2: string = 'Carriers';
  query3: string = 'Locais_Karrara_Transport';
  horaJanela1: string = "08:00";
  horaJanela2: string = "";
  horaJanela3: string = "";
  horaJanela4: string = "";
  horaJanela5: string = "";
  horaJanela6: string = "";
  carriers: any[] = [];
  places: any[] = [];


  constructor(
    private carregaService: CarregaService,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<EditaFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any



  ) {

  }

  ngOnInit() {
    this.query = this.data.query;
    const teste = this.data;
    this.getCarriersFromDynamoDB();
    this.getPlacesFromDynamoDB();

  }

  formatarHora(data: Date): string {
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }


  getCarriersFromDynamoDB(): void {
    const filtro = 'all';
    this.apiService.getItems(this.query2, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.carriers = items.map(item => ({ ...item, checked: false }));
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

  updateHoraJanela1(): void {
    // Verifique se horaJanela1 possui um valor válido antes de atualizar a data original
    if (this.horaJanela1) {
      // Divide a hora em horas e minutos
      const [horas, minutos] = this.horaJanela1.split(':').map(Number);

      // Atualiza a data original com a hora e os minutos selecionados
      this.data.itemsData.local['Janela 1'].setHours(horas);
      this.data.itemsData.local['Janela 1'].setMinutes(minutos);
    }
  }

  getPlacesFromDynamoDB(): void {
    const filtro = 'all';
    this.apiService.getItems(this.query3, this.urlConsulta, filtro).subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          try {
            const items = JSON.parse(response.body);
            if (Array.isArray(items)) {
              this.places = items.map(item => ({ ...item, checked: false }));
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

  updateLocal(key: string, value: string) {
    this.data.itemsData.local[key] = value;
  }


  salvar() {


    const datapadrao = '2006-04-04';

    const janela1 = this.carregaService.adicionarHora(this.data.janela1, new Date(datapadrao));
    const janela2 = this.carregaService.adicionarHora(this.data.janela2, new Date(datapadrao));
    const janela3 = this.carregaService.adicionarHora(this.data.janela3, new Date(datapadrao));
    const janela4 = this.carregaService.adicionarHora(this.data.janela4, new Date(datapadrao));
    const janela5 = this.carregaService.adicionarHora(this.data.janela5, new Date(datapadrao));
    const janela6 = this.carregaService.adicionarHora(this.data.janela6, new Date(datapadrao));

    if (this.data.itemsData.local.ID === undefined) {
      const currentDate = new Date();

      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const seconds = currentDate.getSeconds();

      const totalSeconds = hours * 3600 + minutes * 60 + seconds;

      const formattedDate = currentDate.getDate().toString().padStart(2, '0') +
        (currentDate.getMonth() + 1).toString().padStart(2, '0') +
        totalSeconds.toString() +
        currentDate.getFullYear().toString();

        let passos = 0
        if (this.data.itemsData.local && this.data.itemsData.local['Local 1']) {
          if(this.data.itemsData.local['Local 1']!== 'undefined'){
            passos = passos + 1;
          }

        }
        if (this.data.itemsData.local && this.data.itemsData.local['Local 2']) {
          if(this.data.itemsData.local['Local 2']!== 'undefined'){
            passos = passos + 1;
          }
        }
        if (this.data.itemsData.local && this.data.itemsData.local['Local 3']) {
          if(this.data.itemsData.local['Local 3']!== 'undefined'){
            passos = passos + 1;
          }
        }
        if (this.data.itemsData.local && this.data.itemsData.local['Local 4']) {
          if(this.data.itemsData.local['Local 4']!== 'undefined'){
            passos = passos + 1;
          }
        }
        if (this.data.itemsData.local && this.data.itemsData.local['Local 5']) {
          if(this.data.itemsData.local['Local 5']!== 'undefined'){
            passos = passos + 1;
          }
        }
        if (this.data.itemsData.local && this.data.itemsData.local['Local 6']) {
          if(this.data.itemsData.local['Local 6']!== 'undefined'){
            passos = passos + 1;
          }
        }



      this.data.itemsData = {
        "ID": formattedDate,
        "Transportadora": this.data.itemsData.local.Transportadora,
        "Plate": this.data.itemsData.local.Plate,
        "Viagem": this.data.itemsData.local.Viagem,
        "Local 1": this.data.itemsData.local['Local 1'],
        "Local 2": this.data.itemsData.local['Local 2'],
        "Local 3": this.data.itemsData.local['Local 3'],
        "Local 4": this.data.itemsData.local['Local 4'],
        "Local 5": this.data.itemsData.local['Local 5'],
        "Local 6": this.data.itemsData.local['Local 6'],
        "Janela 1": new Date(janela1),
        "Janela 2": new Date(janela2),
        "Janela 3": new Date(janela3),
        "Janela 4": new Date(janela4),
        "Janela 5": new Date(janela5),
        "Janela 6": new Date(janela6),
        "Passos": passos,
        "tableName": this.query
      }
    } else {



      let passos = 0
      if (this.data.itemsData.local && this.data.itemsData.local['Local 1']) {
        if(this.data.itemsData.local['Local 1']!== 'undefined'){
          passos = passos + 1;
        }

      }
      if (this.data.itemsData.local && this.data.itemsData.local['Local 2']) {
        if(this.data.itemsData.local['Local 2']!== 'undefined'){
          passos = passos + 1;
        }
      }
      if (this.data.itemsData.local && this.data.itemsData.local['Local 3']) {
        if(this.data.itemsData.local['Local 3']!== 'undefined'){
          passos = passos + 1;
        }
      }
      if (this.data.itemsData.local && this.data.itemsData.local['Local 4']) {
        if(this.data.itemsData.local['Local 4']!== 'undefined'){
          passos = passos + 1;
        }
      }
      if (this.data.itemsData.local && this.data.itemsData.local['Local 5']) {
        if(this.data.itemsData.local['Local 5']!== 'undefined'){
          passos = passos + 1;
        }
      }
      if (this.data.itemsData.local && this.data.itemsData.local['Local 6']) {
        if(this.data.itemsData.local['Local 6']!== 'undefined'){
          passos = passos + 1;
        }
      }

      this.data.itemsData = {
        "ID": this.data.itemsData.local.ID,
        "Transportadora": this.data.itemsData.local.Transportadora,
        "Plate": this.data.itemsData.local.Plate,
        "Viagem": this.data.itemsData.local.Viagem,
        "Local 1": this.data.itemsData.local['Local 1'],
        "Local 2": this.data.itemsData.local['Local 2'],
        "Local 3": this.data.itemsData.local['Local 3'],
        "Local 4": this.data.itemsData.local['Local 4'],
        "Local 5": this.data.itemsData.local['Local 5'],
        "Local 6": this.data.itemsData.local['Local 6'],
        "Janela 1": new Date(janela1),
        "Janela 2": new Date(janela2),
        "Janela 3": new Date(janela3),
        "Janela 4": new Date(janela4),
        "Janela 5": new Date(janela5),
        "Janela 6": new Date(janela6),
        "Passos": passos,
        "tableName": this.query
      }

    }

    // Remover as barras invertidas escapadas
    const itemsDataString = JSON.stringify(this.data.itemsData); // Acessa a string desejada
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

    this.apiService.salvar(jsonArray, this.query, this.urlAtualiza).subscribe(response => {

    }, error => {
      console.log(error);
    });
    this.dialogRef.close('resultado do diálogo');
  }

  cancel(): void {
    this.dialogRef.close();
  }


}

