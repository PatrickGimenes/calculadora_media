export class mediaService {
  private nota1: number;
  private nota2: number;
  private nota3: number;
  private nota4: number;

  constructor(v1: number, v2: number, v3: number, v4: number) {
    this.nota1= v1;
    this.nota2 = v2;
    this.nota3 = v3;
    this.nota4 = v4;
  }

  calcMedia():number{
    const total = this.nota1 + this.nota2 + this.nota3 + this.nota4;
    
    const media = total/4;

    return media;
  }

  retornaSituacao(media:number):string{

    if(media >= 6){
      return 'A';
    }
    else{
      return 'R';
    }
  }
}
