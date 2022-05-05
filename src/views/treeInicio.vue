<template>

<div class="inicio">

    <telon :hidden="hiddentelon"/>

    <div class="wrapper text-start">

        <!-- LISTA DE PANTALLAS -->
        <nav id="treePantallas">
    
            <div class="card-body">

                <!-- NIVEL 0 -->
                <ul class="nivel0">

                    <div v-for="tipo of dTipos" :key="tipo.id">
                    <li>

                        <a :href="'#S' + tipo.id" data-bs-toggle="collapse" aria-expanded="false">
                            {{tipo.literal}} 
                        </a>                        

                        <!-- NIVEL 1 -->
                        <ul class="collapse nivel1" :id="'S' + tipo.id">

                            <!-- Opciones del submenu NIVEL 1 -->
                            <div v-for="scr1 of aDocumentos" :key="scr1.id">
                            <li v-if="scr1.tipo == tipo.id">

                                <p>
                                    <span v-if="scr1.isActiva == true" class="iconos inline-icon btn-img material-icons" title="Versión activa!">radio_button_unchecked</span>
                                    <span v-if="scr1.isActiva != true" class="iconos inline-icon btn-img material-icons" style="color:silver" title="Versión inactiva!">radio_button_unchecked</span>
                                    {{scr1.titulo}} (v.{{scr1.version}})
                                    <span @click="Editar(scr1.id)" class="iconos inline-icon btn-img material-icons">edit</span>
                                    <span @click="Borrar(scr1.id)" class="iconos inline-icon btn-img material-icons">delete</span>
                                    <span @click="Clonar(scr1.id)" class="iconos inline-icon btn-img material-icons">content_copy</span>
                                    
                                </p>

                            </li>
                            </div>

                        </ul>

                    </li>
                    </div>

                </ul>


            </div>

        </nav>

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
            dTipos: [
                {id: 'G', literal: "Tabla de gestiones"},
                {id: 'C', literal: "CRUD (un registro: create / update)"},
                {id: 'D', literal: "Capturar/Informar datos"},
                {id: 'I', literal: "Listado o Informe"},
                {id: 'B', literal: "Buscador"},
                {id: 'S', literal: "Selector"},
            ],           
            // Modelo de la definicion            
            modelo: {
                oDatosGenerales: {
                    screenId: funciones.generarUUID2(), 
                    titulo: '',
                    version: 0,
                    activa: false,                    
                },
                oDisenio: {
                    titulo: '',
                    subtitulo: '',
                    tipo: '0'
                }
            }

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

                datos.leerLista("sys_screens", "true", ["clave","id", "titulo","tipo","version","activa"], "")
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

                                let xtipo = this.dTipos[this.dTipos.findIndex(t => t.id === result.data[x].tipo)].literal;
                                
                                this.aDocumentos.push({
                                    clave: result.data[x].clave,
                                    id: result.data[x].id,
                                    titulo: result.data[x].titulo,
                                    tipo: result.data[x].tipo,
                                    tipo_lit: xtipo,
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

                        datos.borrarScreen("id='" + pId + "'")
                        .then((result) => {

                            if(result.success == 1 && result.status == 200) {
                                funciones.popAlert('success', 'Definición eliminada!', false, false, 3000, "Ok")
                                .then(() => {
                                    this.leerScreens();
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

                                delete this.modelo.oCRUD00;
                                
                                let tmp = this.modelo;
                            
                                tmp.oDatosGenerales.screenId = funciones.generarUUID2();
                                tmp.oDatosGenerales.titulo = "Copia de " + this.modelo.oDatosGenerales.titulo;
                                tmp.oDatosGenerales.version = 0;
                                tmp.oDatosGenerales.activa = false;
 
                                // Almacenar propiedades del documento
                                let almacenar = {
                                    id:      tmp.oDatosGenerales.screenId, 
                                    titulo:  tmp.oDatosGenerales.titulo, 
                                    version: tmp.oDatosGenerales.version,
                                    tipo:    tmp.oDisenio.tipo,
                                    activa:  tmp.oDatosGenerales.activa, 
                                    objeto:  JSON.stringify(this.modelo, null, '\t')
                                };
                                datos.grabarScreen(almacenar)
                                .then((result) => {

                                    if(result.success == 1 && result.status == 201) {

                                        funciones.popAlert("success", "Nueva definición creada!", false, false, 3000, "ok")
                                        .then(() => {
                                            this.leerScreens();
                                        });

                                    } else {
                                        funciones.popAlert("error", "No se ha podido grabar!", false, false, 3000, "ok")
                                    }

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
