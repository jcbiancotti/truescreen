<template>
  <div class="home">
    
    <telon :hidden="hiddentelon"/>
    
    <!-- LISTA DE PANTALLAS -->
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
                    
                    <div class="card-footer text-end">
                        <span @click="Editar(documento.id)" class="iconos inline-icon btn-img material-icons" title="Editar este documento">edit</span>
                        <span @click="Clonar(documento.id)" class="iconos inline-icon btn-img material-icons" title="Duplicar este documento">content_copy</span>
                        <span @click="Borrar(documento.id)" class="iconos inline-icon btn-img material-icons" title="Borrar este documento">delete</span>

                        
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

                datos.leerLista("sys_screens", "true", ["clave","id", "titulo","version","activa"], "")
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
        Editar(pId) {
            this.$router.push("/editscreen/" + pId)
        },        
        Borrar(pId) {

            funciones.popAlert('warning', 'Quieres borrar la definición de esta pantalla?', true, true, 8000, "Sí, bórrala!")
            .then((result) => {

                if(result==true) {

                    try {

                        this.hiddentelon = false;

                        datos.borrarPantalla("id='" + pId + "'")
                        .then((result) => {

                            if(result.success == 1 && result.status == 200) {
                                funciones.popAlert('success', 'Definición eliminada!', false, false, 3000, "Ok")
                                .then(() => {
                                    this.leerDocumentos();
                                })

                            } else {
                                funciones.popAlert('error', 'No se ha podido eliminar la definición en este momento', true, false, 8000, "Ok")
                            }

                        }).finally(() => {
                            this.hiddentelon = true;
                        });
                        
                    } catch (error) {
                        console.log(error);
                    }
                    
                }

            })

        },
        Clonar(pId) {

            funciones.popAlert('question', 'Quieres hacer una copia de la definición de esta pantalla?', true, true, 8000, "Sí, cópiala")
            .then((result) => {

                if(result==true) {

                    this.hiddentelon = false;   

                    try {

                        datos.leerLista('sys_screens', "id='" + pId + "'", ['objeto'], '')
                        .then((result) => {

                            if(result.success == 1 && result.status == 200) {

                                this.modelo = JSON.parse(result.data[0].objeto.split('&quot;').join('"'));

                                let tmp = this.modelo;
                            
                                tmp.oMetadatos.docuId = funciones.generarUUID2();
                                tmp.oMetadatos.titulo = "Copia de " + this.modelo.oMetadatos.titulo;
                                tmp.oMetadatos.version = 0;
                                tmp.oMetadatos.activa = false;

                                // Almacenar propiedades del documento
                                let almacenar = {id: tmp.oMetadatos.docuId, objeto: JSON.stringify(this.modelo, null, '\t')};
                                datos.grabarPantalla(almacenar)
                                .then(() => {

                                    funciones.popAlert("success", "Nueva definición creada!", false, false, 3000, "ok")
                                    .then(() => {
                                        this.leerPantallas();
                                    });

                                })


                            }

                        }).finally(() => {
                            this.hiddentelon = true;
                        });

                    } catch(error) {
                        console.log(error);
                    }

                }

            })

        },

    },
    mounted() {
        this.leerScreens();

    }
}
</script>
