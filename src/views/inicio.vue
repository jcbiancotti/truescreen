<template>
  <div class="home">
    
    <telon :hidden="hiddentelon"/>
    
    <!-- LISTA DE DOCUMENTOS -->
    <div class="card-deck">

        <div class="row p-2" v-for="documento of aDocumentos" :key="documento.clave">

            <div class="col d-flex pt-3">

                <div class="card">

                    <div class="card-header text-left" style="line-height:12px;background-color: var(--true-color-empresa);">
                        <p style="color:silver">documento id: {{documento.id}}</p>
                    </div>
                    <div class="card-body text-justify" style="line-height : 12px;">

                        <p>Título: {{documento.titulo}}</p>
                        <p>Version: {{documento.version}}</p>
                        <p>
                            <label class="content-input">
                                <input type="checkbox" v-model="documento.isActiva" :disabled="true">
                                <i></i>
                            </label>
                        </p>

                    </div>
                    
                    <div class="card-footer">
                        <router-link :to="`${'/editdoc/' + documento.id}`" class="btn float-right" title="Editar este documento">
                            <i class="fas fa-edit"></i>
                        </router-link>
                        <a @click="Clonar(documento.id)" class="btn float-right" title="Duplicar este documento"> <i class="far fa-copy"></i> </a>
                        <a @click="Borrar(documento.id)" class="btn float-right" title="Borrar este documento"  > <i class="far fa-trash-alt"></i> </a>

                        
                    </div>

                </div>

            </div>

        </div>

    </div>

  </div>
</template>

<script>

import funciones from '@/utils/funciones'
import datos from '@/utils/datos'
import telon from '@/components/visuales/telon'

export default {
    name: 'Home',
    data(){
        return {
            hiddentelon: true,
            aDocumentos: [],
            // Modelo del documento
            modelo: {
                oMetadatos: {
                    docuId: '', 
                    titulo: '',
                    version: 0,
                    activa: false,
                    orientacion: 'V',
                    ancho: 595,
                    alto: 842,
                },
                oHeader: {
                    backcolor: "#FFFFFF",
                    height: (842*20/100),
                    hPorce: 20,
                    logo: {
                        SiNo: false,
                        posY: 10,
                        posX: 10,
                        height: 100,
                        width: 100,
                        img: '',
                        pHeight: 33,
                        pWidth: 10,
                    },
                    textos: [],
                },
                oSubHeader: {
                    backcolor: "#FFFFFF",
                    height: (842*5/100),  
                    hPorce: 5,
                    textos: [],
                },
                oBody: {
                    backcolor: "#FFFFFF",
                    height: (842*55/100),
                    hPorce: 55,   
                    textos: [], 
                },
                oSubTotales: {
                    backcolor: "#FFFFFF",
                    height: (842*5/100), 
                    hPorce: 5,  
                    textos: [],
                },
                oPie: {
                    backcolor: "#FFFFFF",
                    height: (842*15/100),
                    hPorce: 15,
                    textos: [],
                },
                oCampos: [],

            },

        }
    },
    components:{
        telon,

    },
    methods: {
    leerScreens() {

        try {

            this.aDocumentos = [];

            this.hiddentelon = false;

            datos.leerLista("sys_head_screens", "true", ["clave","id", "titulo","version","activa"], "")
            .then((result) => {

                if(global.DEBUG)
                    console.log("leerScreens", "datos devueltos datos.leerLista", result);


                if(result.success == 1) {

                    if(result.status == 200) {

                        for(let x = 0; x < result.data.length; x++) {

                            let act = false;
                            if(result.data[x].activa == 1) {
                                act = true;
                            }
                            
                            this.aDocumentos.push({
                                clave: result.data[x].clave,
                                id: result.data[x].id,
                                titulo: result.data[x].titulo,
                                version:result.data[x].version,
                                activa:result.data[x].activa,
                                isActiva: act
                            });
                            
                        }

                    } 

                }

            }).finally(() => {
                this.hiddentelon = true;
            });

        } catch(error) {
            console.log(error)
        }


    },
    Borrar(pId) {

        funciones.popAlert('warning', 'Quieres borrar la definición de este documento?', true, true, 8000, "Sí, bórralo!")
        .then((result) => {

            if(result==true) {

                try {

                    this.hiddentelon = false;

                    datos.borrarDocumento("id='" + pId + "'")
                    .then((result) => {

                        if(result.success == 1 && result.status == 200) {
                            funciones.popAlert('success', 'Documento eliminado!', false, false, 3000, "Ok")
                            .then(() => {
                                this.leerDocumentos();
                            })

                        } else {
                            funciones.popAlert('error', 'No se ha podido eliminar el documento en este momento', true, false, 8000, "Ok")
                        }

                    }).finally(() => {
                        this.hiddentelon = true;
                    })
                    
                } catch (error) {
                    console.log(error);
                }
                
            }

        })

    },
    Clonar(pId) {

        funciones.popAlert('question', 'Quieres hacer una copia de la definición de este documento?', true, true, 8000, "Sí, cópialo")
        .then((result) => {

            if(result==true) {

                this.hiddentelon = false;   

                try {

                    datos.leerLista('sys_documentos', "id='" + pId + "'", ['objeto'], '')
                    .then((result) => {

                        if(result.success == 1 && result.status == 200) {

                            this.modelo = JSON.parse(result.data[0].objeto.split('&quot;').join('"'));

                            let tmp = this.modelo;
                        
                            tmp.oMetadatos.docuId = funciones.generarUUID2();
                            tmp.oMetadatos.titulo = "Copia de " + this.modelo.oMetadatos.titulo;
                            tmp.oMetadatos.version = 0;
                            tmp.oMetadatos.activa = false;

                            let almacenar = {id: tmp.oMetadatos.docuId, titulo: tmp.oMetadatos.titulo, version: tmp.oMetadatos.version, activa: tmp.oMetadatos.activa};
                            datos.grabarHeadDocumento(almacenar)                             
                            .then((result) => {

                                if(result.success == 1 && result.status == 201) {

                                    // Almacenar propiedades del documento
                                    almacenar = {id: tmp.oMetadatos.docuId, objeto: JSON.stringify(this.modelo, null, '\t')};
                                    datos.grabarDocumento(almacenar)
                                    .then(() => {

                                        funciones.popAlert("success", "Nuevo documento creado!", false, false, 3000, "ok")
                                        .then(() => {
                                            this.leerDocumentos();
                                        });

                                    })

                                }

                            })

                        }

                    }).finally(() => {
                        this.hiddentelon = true;
                    })

                } catch(error) {
                    console.log(error);
                }

            }

        })

    },

  },
  mounted() {
    this.leerScreens();

  },
}
</script>
