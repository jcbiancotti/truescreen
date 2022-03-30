<template>
<div class="input-group addon">

    <telon :hidden="hiddentelon"/>

    <label class="float-start">Valor inicial:</label>

    <p class="btn" @click="flagExpandir = !flagExpandir" :title="tituloElegida">
        <img :src='banderaElegida' width='25'/>  
        {{elegida}}
    </p> 

    <div v-if="flagExpandir" class="banderas">
        <p class="seleccionada" @click="flagExpandir=false">
            <span >
                <img :src='banderaElegida' width='25'/>
                {{elegida.toUpperCase()}} 
                {{tituloElegida}}
            </span>
        </p>   
        <div style="border: 1px solid var(--true-button-border);"></div>                 
        <p v-for="banderita in banderitas" :key="banderita.codigo" @click="cambiaPais(banderita.idx)" class="bandera" :class="{seleccionada : banderita.codigo == elegida}"> 
           <span >
                <img :src='banderita.imgreq' width='25'/>
                {{banderita.codigo.toUpperCase()}} 
                {{banderita.nombre}}
                <span v-if="banderita.cod_telefono != ''">({{banderita.cod_telefono}})</span>
            </span>
        </p>
    </div>

    <!-- NUMERO DE TELEFONO -->
    <input type="text" class="form-control" v-model="codTelefono" disabled> 
    <input type="text" class="form-control" v-model="nroTelefono" @blur="cambiaTelefono()" :maxlength="maximo"> 

</div>
</template>

<script>

import datos from '@/utils/datos'
import telon from '@/components/visuales/telon'

export default {
    name: 'inputPhone',
    data() {
        return {
            hiddentelon: true,
            flagExpandir: false,
            paises: [],
            banderitas:[],
            elegida: 'ES',
            banderaElegida: '',
            tituloElegida: '',
            codTelefonoElegida: '',
            codTelefono: '',
            nroTelefono: '',

        }
    },
    components: {
        telon,
    },
    props:{
        valor: String,
        maximo: {
            default: 9           
        }
    },
    methods: {
        getIllustrations() {

            try {

                this.hiddentelon = false;

                if (this.valor == '') {
                    this.elegida = 'ES';
                    this.nroTelefono = '';                    
                } else {
                    let tmpTel = this.desgloseTelefono();

                    this.elegida = tmpTel.elegida;
                    this.codTelefono = tmpTel.codTelefono;
                    this.nroTelefono = tmpTel.nroTelefono;
                }          

                const illustrations = require.context('@/assets/img/flags', true, /^.*\.svg$/)

                illustrations.keys().forEach((key) => {

                    let cdgo = key.substr(2).replace('.svg','').toUpperCase();
                    let imf = '@/assets/img/flags/' + key.substr(2);

                    this.banderitas.push({
                        idx: this.banderitas.length,
                        codigo: cdgo,
                        img: imf,
                        imgreq: require('@/assets/img/flags/' + key.substr(2)),
                        nombre: '',
                        cod_telefono: ''
                    })

                    if(cdgo == this.elegida) {
                        this.banderaElegida = require('@/assets/img/flags/' + key.substr(2));
                        this.tituloElegida = '';
                        this.codTelefonoElegida = '';
                    }

                })

                // Particularidades de la capa pais
                this.paises = [];

                datos.leerLista("sys_capapais", "1=1", ['codigo','nombre','codigo_telefono'], '')
                .then((result) => {

                    if(result.success == 1 && result.status == 200) {

                        for(let x=0; x < result.data.length; x++) {

                            this.paises.push({
                                codigo: result.data[x].codigo,
                                nombre: result.data[x].nombre,
                                codigo_telefono: result.data[x].codigo_telefono
                            })

                            // Completar los datos en las banderas
                            let xbandera = this.banderitas.findIndex(z => z.codigo === result.data[x].codigo) 

                            if(xbandera != -1) {
                                this.banderitas[xbandera].nombre = result.data[x].nombre;
                                this.banderitas[xbandera].cod_telefono = result.data[x].codigo_telefono;
                            }

                        }
                        // Completar los datos en la elegida
                        let xelegida = this.banderitas.findIndex(z => z.codigo === this.elegida)
                        if(xelegida != -1) {
                            this.tituloElegida = this.banderitas[xelegida].nombre;
                            this.codTelefono = this.banderitas[xelegida].cod_telefono;
                            this.codTelefonoElegida = this.banderitas[xelegida].cod_telefono;
                        }

                    }

                })                
                
                this.hiddentelon = true;

            } catch (error) {
                console.log(error);
            }

        },
        cambiaPais(pId) {
            this.elegida        = this.banderitas[pId].codigo; 
            this.banderaElegida = this.banderitas[pId].imgreq; 
            this.tituloElegida  = this.banderitas[pId].nombre; 
            this.codTelefono    = this.banderitas[pId].cod_telefono;
            this.codTelefonoElegida = this.banderitas[pId].cod_telefono;

            this.flagExpandir=false;

            this.$emit("asigneValor", "(" + this.banderitas[pId].codigo + ")*" + this.codTelefono + "*" + this.nroTelefono);
            
        },
        cambiaTelefono() {
            this.$emit("asigneValor", "(" + this.elegida + ")*" + this.codTelefono + "*" + this.nroTelefono);
        },
        desgloseTelefono() {
            
            let tmpCodigo = this.valor.substr(1);
            tmpCodigo = tmpCodigo.substr(0, tmpCodigo.indexOf(')') );

            let tmpCodTelefono = this.valor.substr(this.valor.indexOf('*') + 1);
            let tmpNroTelefono = tmpCodTelefono.substr(tmpCodTelefono.indexOf('*') + 1);
            tmpCodTelefono = tmpCodTelefono.substr(0, tmpCodTelefono.indexOf('*') );

            let retorno = {
                elegida: tmpCodigo,
                codTelefono: tmpCodTelefono,
                nroTelefono: tmpNroTelefono
            }

            return retorno;
        } 

    },
    mounted() {
        // Cargar lista de banderas
        this.getIllustrations();



    },
    watch: {
        valor() {

            let tmpTel = this.desgloseTelefono();

            this.elegida = tmpTel.elegida;
            this.codTelefono = tmpTel.codTelefono;
            this.nroTelefono = tmpTel.nroTelefono;

            let xtmp = this.banderitas.findIndex(x => x.codigo === this.elegida);
            if(xtmp != -1) {
                this.banderaElegida = this.banderitas[xtmp].imgreq;
                this.codTelefono = this.banderitas[xtmp].cod_telefono;
                this.codTelefonoElegida = this.banderitas[xtmp].cod_telefono;
            }

        }
    }

}
</script>

<style scoped>

.banderas {
    position: absolute;
    z-index:1001;
    background-color:white;
    border: 1px solid var(--true-button-border);
    width: 40%;
    max-height:200px;
    overflow: auto;
}
.bandera {
    margin: 0;
}
.bandera:hover {
    color: var(--true-button-hover-color);
    background-color: var(--true-button-hover-background);
}

.seleccionada {
    color: var(--true-button-hover-color);
    background-color: var(--true-button-hover-background);
    margin: 0;

}
</style>
