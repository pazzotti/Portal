import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import * as XLSX from 'xlsx';
import { addDays, addHours, format, parse } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class CarregaService {

  constructor(private http: HttpClient, private papa: Papa) { }

  getFileContent(fileUrl: string): Promise<string> {
    return this.http.get(fileUrl, { responseType: 'text' })
      .toPromise()
      .then(response => response || '');
  }




  loadFile(fileBlob: Blob): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileData = event.target?.result;
        if (typeof fileData === 'string') {
          const workbook: XLSX.WorkBook = XLSX.read(fileData, { type: 'binary' });
          const sheetName: string = workbook.SheetNames[0]; // Assume que o arquivo possui apenas uma planilha
          const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
          const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const filteredData = this.filterRows(jsonData); // Filtra as linhas de acordo com os critérios
          resolve(filteredData);
        } else {
          reject(new Error('Erro ao ler o arquivo.'));
        }
      };

      reader.onerror = (event) => {
        reject(event.target?.error || new Error('Erro ao ler o arquivo.'));
      };

      reader.readAsBinaryString(fileBlob);
    });
  }

  filterRows(data: any[]): any[] {
    const filteredData: any[] = [];
    let skipFirstRow = true;

    for (const row of data) {
      if (skipFirstRow) {
        skipFirstRow = false;
        continue;
      }

      const cellValue = row[6]; // Coluna 7 (índice 6) baseada em 0

      if (cellValue === undefined || cellValue === null || cellValue === '') {
        break; // Para de carregar linhas ao encontrar uma célula vazia na coluna 7
      }

      filteredData.push(row);
    }

    return filteredData;
  }



  formatDate(serialNumber: number): Date {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const excelDate = new Date(excelEpoch.getTime() + (serialNumber - 1) * millisecondsPerDay);
    const formattedDate = addDays(excelDate, 1);

    const formattedDate2 = addHours(formattedDate,3);
    return formattedDate2;
  }

  formatHora(serialNumber: number, dataBase: Date): string {
    const dataConverte = new Date(dataBase);
    const millisecondsPerDay = serialNumber * 24 * 60 * 60 * 1000;
    const excelHora = new Date(millisecondsPerDay);
    const HoraJanela = new Date(dataConverte.getTime() + excelHora.getTime());
    HoraJanela.setHours(HoraJanela.getHours() + 3);

    return HoraJanela.toISOString();
  }

  adicionarHora(hora: string, data: Date): Date {
    // Divide a hora em horas e minutos
    if(hora === null){
      hora = '00:00'
    }
    const [horas, minutos] = hora.split(':').map(Number);

    // Cria uma nova data com os valores da data original
    const novaData = new Date(data);

    // Adiciona as horas e minutos à nova data
    novaData.setHours(novaData.getHours() + horas + 3);
    novaData.setMinutes(novaData.getMinutes() + minutos);

    return novaData;
  }

  naoadicionarHora(hora: string, data: Date): Date {
    // Divide a hora em horas e minutos
    if(hora === null){
      hora = '00:00'
    }
    const [horas, minutos] = hora.split(':').map(Number);

    // Cria uma nova data com os valores da data original
    const novaData = new Date(data);

    // Adiciona as horas e minutos à nova data
    novaData.setHours(novaData.getHours() + horas);
    novaData.setMinutes(novaData.getMinutes() + minutos);

    return novaData;
  }





  processData(fileContent: string): any[] {
    const parsedData = this.papa.parse(fileContent, {
      header: true,
      delimiter: ';'
    }).data;
    const result = [];
    const seen = new Set();
    for (const row of parsedData) {
      const {
        'Process': Process,
        'Container Id': Container,
        ' Channel': Channel,
        'Clearance Place': ClearancePlace,
        'Step': Step,
        'Transp. Type': Transport,
        'Invoice Number': Invoice,
        'SLine': Liner,
        'ATA': ATA,
        'Vessel Name/Flight (SLine)': Vessel
        // Continuar com os ajustes para as demais propriedades
      } = row;

      if (!Container || Container.trim().length === 0 || Transport != 10 || ATA === '') {
        continue; // pula linhas vazias e com Supplier Number vazio
      }

      const key = `${Container},${Process}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push({
          Process,
          Container,
          Channel,
          ClearancePlace,
          Step,
          Transport,
          Invoice,
          Liner,
          ATA,
          Vessel
          // Continuar com as demais propriedades que deseja extrair
        });
      }
    }

    return result;
  }



  testarArquivoCSV(arquivo: File): Promise<TesteArquivoResultado> {
    return new Promise<TesteArquivoResultado>((resolve, reject) => {
      this.papa.parse(arquivo, {
        complete: (result: any) => {
          const dados = result.data;
          const cabecalho = result.meta.fields;
          const erros = result.errors;
          const estaCorreto = this.validarArquivoCSV(dados, cabecalho, erros);
          const resultado: TesteArquivoResultado = {
            estaCorreto,
            dados,
            cabecalho,
            erros
          };
          resolve(resultado);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  validarArquivoCSV(dados: any[], cabecalho: string[], erros: any[]): boolean {
    // Verificar se existem erros de parsing no arquivo
    if (erros && erros.length > 0) {
      return false;
    }

    // Verificar se o cabeçalho está correto
    const cabecalhoEsperado = ['Process', 'Container Id', 'Channel', 'Clearance Place', 'Step', 'Transp. Type', 'Invoice Number', 'SLine', 'ATA', 'Vessel Name/Flight (SLine)'];
    if (!cabecalho || !this.arrayEquals(cabecalho, cabecalhoEsperado)) {
      return false;
    }

    // Verificar se os dados estão corretos
    if (!dados || dados.length === 0) {
      return false;
    }

    // Verificar se todos os dados estão preenchidos corretamente
    for (const row of dados) {
      if (!row || Object.values(row).some(value => value === null || value === undefined || value === '')) {
        return false;
      }
    }

    // Se chegou até aqui, o arquivo está correto
    return true;
  }

  // Função auxiliar para verificar se dois arrays são iguais
  arrayEquals(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }


}

interface TesteArquivoResultado {
  estaCorreto: boolean;
  dados: any[];
  cabecalho: string[];
  erros: any[];

}
