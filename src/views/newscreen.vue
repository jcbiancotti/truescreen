<template>
<div class="container-fluid">

    <telon :hidden="hiddentelon"/>

    <h1 v-if="claveId != null">Definición de la pantalla: {{modelo.oDatosGenerales.titulo}} ({{claveId}})</h1>

    <!-- ICONO HAY ERRORES -->
    <div v-if="errores.length > 0" @click="E_expanded = !E_expanded" class="float-end p-2">

        <span v-if="error_grave > 0">Hay {{error_grave}} errores</span>
        <span v-if="error_grave == 0 && error_warning > 0">Hay {{error_warning}} alertas</span>

        <span v-if="E_expanded == false && error_grave > 0" class="iconos inline-icon btn-img material-icons float-end" style="color:red;" title="Errores bloqueante">error</span>
        <span v-if="E_expanded == false && error_grave == 0 && error_warning > 0" class="iconos inline-icon btn-img material-icons float-end" style="color:yellow;" title="Advertencias">warning</span>

        <span v-if="E_expanded == true && error_grave > 0" class="iconos inline-icon btn-img material-icons float-end" style="color:red;">close</span>
        <span v-if="E_expanded == true && error_grave == 0 && error_warning > 0"  class="iconos inline-icon btn-img material-icons float-end" style="color:yellow;">close</span>

    </div>
 
    <!-- TABS -->
    <ul class="nav nav-pills" role="tablist">
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 1}" @click="tab=1" data-toggle="tab" href="#datos-screen">Datos generales</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 2}" @click="tab=2" data-toggle="tab" href="#datos-disenio">Dise&ntilde;o</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 3 && modelo.oDisenio.tipo == 'G', disabled : modelo.oDisenio.tipo != 'G'}" @click="tab=3" data-toggle="tab" href="#datos-gestiones">Tabla de gestiones</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 4 && modelo.oDisenio.tipo == 'C', disabled : modelo.oDisenio.tipo != 'C'}" @click="tab=4" data-toggle="tab" href="#datos-crud">CRUD</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 5 && modelo.oDisenio.tipo == 'D', disabled : modelo.oDisenio.tipo != 'D'}" @click="tab=5" data-toggle="tab" href="#datos-cdatos">Informar datos</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 6 && modelo.oDisenio.tipo == 'I', disabled : modelo.oDisenio.tipo != 'I'}" @click="tab=6" data-toggle="tab" href="#datos-listado">Listado / Informe</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 7 && modelo.oDisenio.tipo == 'B', disabled : modelo.oDisenio.tipo != 'B'}" @click="tab=7" data-toggle="tab" href="#datos-buscar">Buscador</a></li>
        <li class="nav-item"><a class="nav-link" :class="{active : tab == 8 && modelo.oDisenio.tipo == 'S', disabled : modelo.oDisenio.tipo != 'S'}" @click="tab=8" data-toggle="tab" href="#datos-selector">Selector</a></li>

        <li class="nav-item"><a class="nav-link" :class="{active : tab == 9}" @click="Grabar()">Grabar</a></li>
    </ul>


    <!-- LISTA DE ERRORES -->
    <div v-if="E_expanded == true" style="border: 1px solid red;margin: 5px;border-radius: 5px !important;">

        <div class="float-end container-fluid">
            <span @click="Validaciones()" class="iconos inline-icon btn-img material-icons float-end" style="color:blue;" title="Comprobar errores">refresh</span>
        </div>

        <div v-for="err of errores" :key="err.idx">

            <div @click="enfocar(err.ref, err.tab)" class="input-group text-left" style="bacground-color: grey;cursor: pointer;">
                <div class="text-center" style="width:5%;">
                    {{err.idx}}
                </div>                
                <div style="width:15%;">
                    <span v-if="errDescripcion(err.codigo, 'C') == 1" class="iconos inline-icon btn-img material-icons" style="color:red;" title="Error bloqueante">error</span>
                    <span v-if="errDescripcion(err.codigo, 'C') == 2" class="iconos inline-icon btn-img material-icons" style="color:yellow;" title="Advertencia">warning</span>
                </div>
                <div style="width:20%;;">
                    {{err.codigo}} - {{errDescripcion(err.codigo, 'L')}}
                </div>
                <div style="width:60%;">
                    {{err.descripcion}}
                </div>
            </div>

        </div>

    </div>

    <!-- Tab panes -->
    <div class="tab-content">

        <!-- DATOS GENERALES -->
        <div id="datos-screen" class="container-fluid tab-pane fade " :class="{show : tab == 1, active : tab == 1}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Datos generales</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <div class="form-group row" style="color: silver;">{{modelo.oDatosGenerales.screenId}}</div>

                        <div class="input-group">
                            <div class="w-50 text-right">
                                <label>(*) T&iacute;tulo:</label>
                            </div>
                            <div class="w-50 text-left">
                                <input ref="scrTitulo" type="text" class="form-control" v-model="modelo.oDatosGenerales.titulo" placeholder="Nombre para identificar la definición">
                            </div>
                        </div> 

                        <div class="input-group">
                            <div class="w-50 text-right">
                                <label>(*) Versi&oacute;n:</label>
                            </div>
                            <div class="w-50 text-left">
                                <input ref="scrVersion" type="text" class="form-control" v-model="modelo.oDatosGenerales.version" placeholder="Versión del documento">
                            </div>
                        </div>

                        <div class="input-group p-2">
                            <div class="w-50 text-right">
                                <label>Versión activada:</label>
                            </div>
                            <div class="w-50 text-left">
                                <label class="content-input">
                                    <input type="checkbox" v-model="modelo.oDatosGenerales.activa">
                                    <i></i>
                                </label>    
                                <span>(Se utilizará la versión activada de mayor valor)</span>
                            </div>
                        </div>

                    </form>

                </div>

            </div>
            </div>

        </div>

        <!-- DISEÑO -->
        <div id="datos-screen" class="container-fluid tab-pane fade " :class="{show : tab == 2, active : tab == 2}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Dise&ntilde;o</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <!-- TITULO -->
                        <div class="input-group">
                            <div class="w-50 text-right">
                                <label>(*) T&iacute;tulo:</label>
                            </div>
                            <div class="w-50">                            
                                <input ref="scrDisenioTitulo" type="text" class="form-control" v-model="modelo.oDisenio.titulo" placeholder="Título principal de la pantalla">
                            </div> 
                        </div>

                        <!-- SUBTITULO -->
                        <div class="input-group">
                            <div class="w-50 text-right">
                                <label>Sub-t&iacute;tulo:</label>
                            </div>
                            <div class="w-50">                            
                                <input ref="scrSubtitulo" type="text" class="form-control" v-model="modelo.oDisenio.subtitulo" placeholder="Subtítulo de la pantalla">
                                <p>Es posible combinar variables con el texto, por ejemplo "Acciones a &fecha_hoy&". La lista de variables se describe en la documentación</p>
                            </div> 

                        </div>

                        <!-- TIPO -->
                        <div class="input-group">
                            <div class="w-50 text-right">
                                <label>(*) Tipo de pantalla:</label>
                            </div>
                            <div class="w-50">
                                <select ref="scrTipo" class="form-select" v-model="this.modelo.oDisenio.tipo">
                                    <option v-for="t of dTipos" :key="t.id" :value="t.id" :disabled="t.id=='0'">{{t.literal}}</option>
                                </select>                                
                            </div> 
                        </div>                      

                    </form>

                </div>

            </div>
            </div>

        </div>

        <!-- TABLA DE GESTIONES -->
        <div id="datos-screen" class="container-fluid tab-pane fade " :class="{show : tab == 3, active : tab == 3}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Tabla de gestiones</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <table>
                            <!-- QUERY -->
                            <tr class="text-start">
                                <td class="text-start">
                                    <label>(*) Consulta de datos:</label>
                                </td>
                                <td class="text-start">
                                    <select ref="tgQuery" class="form-select" v-model="modelo.oTablaGestiones.idQuery" @change="tgCambioQuery()"> 
                                        <option v-for="q of aQuerys" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.id}} {{q.descripcion}}</option>
                                    </select>
                                </td>
                                <td class="text-start">
                                    <span v-if="modelo.oTablaGestiones.idQuery == '0'" class="iconos inline-icon btn-img material-icons" title="Selecciona una consulta">visibility_off</span>
                                    <span @click="CargaConsulta(modelo.oTablaGestiones.idQuery)" v-if="modelo.oTablaGestiones.idQuery != '0'" class="iconos inline-icon btn-img material-icons" title="Ver consulta">visibility</span>
                                </td>
                            </tr>
                            <tr v-if="modelo.oTablaGestiones.idQuery != '0' && tgCadenaSQL != ''">
                                <td colspan="3"> 
                                    <div  class="w-100 input-group addon pb-4">
                                        <div class="container-fluid">
                                            <span @click="tgCadenaSQL = ''" class="iconos inline-icon btn-img material-icons float-end" title="Cerrar">close</span>
                                        </div>
                                        <textarea ref="tgConsultaSQL" id="tgConsultaSQL" class="form-control" disabled rows="5" :maxlength="5000" style="height: 100px;width: 100%;font-family:Courier" v-model="tgCadenaSQL" placeholder="Consulta SQL completa"></textarea>
                                    </div>
                                </td> 
                            </tr>
                        
                        </table>
                        <!-- NUEVA COLUMNA -->
                        <div class="btn-img float-right" @click="tg_expanded = !tg_expanded">
                            <h3 class="float-right">Columnas</h3>
                            <span v-if="tg_expanded == false" class="material-icons">add_circle_outline</span>
                            <span v-if="tg_expanded == true" class="material-icons">remove_circle_outline</span>
                        </div>

                        <div v-if="tg_expanded">     

                            <table>
                                <!-- PRIMER RENGLON -->
                                <tr>
                                    <!-- TITULO -->
                                    <td class="w-30">
                                        <div class="text-left input-group addon">
                                            <label>(*) T&iacute;tulo para la columna:</label>
                                            <input ref="reftgTituloColumna" type="text" class="form-control" v-model="tgTituloColumna" placeholder="Título para la columna">
                                        </div> 
                                    </td>
                                    <!-- CAMPO -->
                                    <td class="w-60">
                                        <div class="text-left input-group addon">
                                            <label>(*) Campo:</label>
                                            <select ref="reftgCampoColumna" class="form-select" v-model="tgCampoColumna">
                                                <option v-for="q of aCampos" :key="q.id" :disabled="q.id=='0'" :value="q.descripcion">{{q.descripcion}}</option>
                                            </select>        
                                        </div>                            
                                    </td>
                                    <!-- BOTONES -->
                                    <td class="w-10">
                                        <span @click="tgAgregar()" class="iconos inline-icon btn-img material-icons" title="Agregar a la lista">save_alt</span>
                                        <span @click="tgDescartar()" class="iconos inline-icon btn-img material-icons" title="Descartar">clear</span>                                    
                                    </td>
                                </tr>
                                <!-- SEGUNDO RENGLON -->
                                <tr>
                                    <td>
                                        <div class="input-group addon">
                                            <label for="reftgOrdenar">Ordenar por esta columna:</label>
                                            <label class="content-input">
                                                <input ref="reftgOrdenar" id="reftgOrdenar" type="checkbox" v-model="tgOrdenarColumna">
                                                <i></i>
                                            </label>                                              
                                        </div>
                                    </td> 
                                    <td>
                                        <div class="input-group addon">
                                            <label for="reftgFiltrar">Filtrar por esta columna:</label>
                                            <label class="content-input">
                                                <input ref="reftgFiltrar" id="reftgFiltrar" type="checkbox" v-model="tgFiltrarColumna">
                                                <i></i>
                                            </label>                                              
                                        </div>
                                    </td>                                     
                                    <td class="text-end" style="color:red;">
                                        {{tgMensaje}}
                                    </td>
                                </tr>                                
                            </table>

                        </div>

                        <!-- LISTA DE COLUMNAS -->
                        <div class="tableFixHead table-responsive" style="height:auto;">
                        <table >
                            <thead>
                                <th>T&iacute;tulo</th>
                                <th>Campo</th>
                                <th>Ordenar</th>
                                <th>filtrar</th>
                                <th></th>
                            </thead>
                            <tr v-for="registro of modelo.oTablaGestiones.Columnas" :key="registro.id">
                                <td>{{registro.titulo}}</td>
                                <td>{{registro.campo}}</td>
                                <td>
                                    <span v-if="registro.ordenar == true">Si</span>
                                    <span v-if="registro.ordenar == false">No</span>
                                </td>
                                <td>
                                    <span v-if="registro.filtrar == true">Si</span>
                                    <span v-if="registro.filtrar == false">No</span>
                                </td>
                                <td>
                                    <span @click="tgQuitar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Eliminar de la lista">delete</span>
                                    <span @click="tgEditar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Editar este registro">mode_edit</span>
                                </td>
                            </tr>

                        </table>
                        </div>

                        <div class="btn-img float-right">
                            <h3 class="float-right">Otros datos</h3>
                            <span class="material-icons">radio_button_unchecked</span>
                        </div>
                        <div class="tableFixHead table-responsive">
                        <table>
                            <!-- PRIMER RENGLON -->
                            <tr>
                                <td>
                                    <div class="input-group addon">
                                        <label for="reftgEditar">Editar los datos de este registro:</label>
                                        <label class="content-input">
                                            <input ref="reftgEditar" id="reftgEditar" type="checkbox" v-model="modelo.oTablaGestiones.Row_editar">
                                            <i></i>
                                        </label>                                              
                                    </div>
                                </td> 
                                <td>
                                    <div class="input-group addon">
                                        <label for="reftgEliminar">Eliminar los datos de este registro:</label>
                                        <label class="content-input">
                                            <input ref="reftgEliminar" id="reftgEliminar" type="checkbox" v-model="modelo.oTablaGestiones.Row_eliminar">
                                            <i></i>
                                        </label>                                              
                                    </div>
                                </td>                                     
                                <td class="text-end" style="color:red;">
     
                                </td>
                            </tr>                                
                        </table>   
                        </div>                     

                    </form>

                </div>

            </div>
            </div>

        </div>

        <!-- CRUD -->
        <div id="datos-crud" class="container-fluid tab-pane fade " :class="{show : tab == 4, active : tab == 4}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>CRUD (create, read, update y delete)</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                        <div class="btn-img float-right">
                            <h3 class="float-right">Paso 1 (Lista de registros)</h3>
                            <span class="material-icons">radio_button_unchecked</span>
                        </div>                        

                        <table>
                            <!-- QUERY PASO 1 del CRUD-->
                            <tr>
                                <td class="text-start" style="width:20%;">
                                    <label>(*) Consulta de datos:</label>
                                </td>
                                <td class="w-60 text-start" style="width:60%;">
                                    <select ref="crQuery" class="form-select" v-model="modelo.oCRUD00.idQuery" @change="crCambioQuery()"> 
                                        <option v-for="q of aQuerys" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.id}} {{q.descripcion}}</option>
                                    </select>
                                </td>
                                <td class="w-10 text-start" style="width:20%;">
                                    <span v-if="modelo.oCRUD00.idQuery == '0'" class="iconos inline-icon btn-img material-icons" title="Selecciona una consulta">visibility_off</span>
                                    <span @click="CargaConsulta(modelo.oCRUD00.idQuery)" v-if="modelo.oCRUD00.idQuery != '0'" class="iconos inline-icon btn-img material-icons" title="Ver consulta">visibility</span>
                                </td>
                            </tr>
                            <tr v-if="modelo.oCRUD00.idQuery != '0' && crCadenaSQL != ''">
                                <td colspan="3"> 
                                    <div  class="w-100 input-group addon pb-4">
                                        <div class="container-fluid">
                                            <span @click="crCadenaSQL = ''" class="iconos inline-icon btn-img material-icons float-end" title="Cerrar">close</span>
                                        </div>
                                        <textarea ref="crConsultaSQL" id="crConsultaSQL" class="form-control" disabled rows="5" :maxlength="5000" style="height: 100px;width: 100%;font-family:Courier" v-model="crCadenaSQL" placeholder="Consulta SQL completa"></textarea>
                                    </div>
                                </td> 
                            </tr>
                        
                        </table>

                        <!-- NUEVA COLUMNA -->
                        <div class="btn-img float-right" @click="cr_expanded = !cr_expanded">
                            <h3 class="float-right">Columnas</h3>
                            <span v-if="cr_expanded == false" class="material-icons">add_circle_outline</span>
                            <span v-if="cr_expanded == true" class="material-icons">remove_circle_outline</span>
                        </div>

                        <div v-if="cr_expanded">     

                            <table>
                                <!-- PRIMER RENGLON -->
                                <tr>
                                    <!-- TITULO -->
                                    <td class="w-30">
                                        <div class="text-left input-group addon">
                                            <label>(*) T&iacute;tulo para la columna:</label>
                                            <input ref="refcrTituloColumna" type="text" class="form-control" v-model="crTituloColumna" placeholder="Título para la columna">
                                        </div> 
                                    </td>
                                    <!-- CAMPO -->
                                    <td class="w-60">
                                        <div class="text-left input-group addon">
                                            <label>(*) Campo:</label>
                                            <select ref="refcrCampoColumna" class="form-select" v-model="crCampoColumna">
                                                <option v-for="q of aCampos" :key="q.id" :disabled="q.id=='0'" :value="q.descripcion">{{q.descripcion}}</option>
                                            </select>        
                                        </div>                            
                                    </td>
                                    <!-- BOTONES -->
                                    <td class="w-10">
                                        <span @click="crAgregar()" class="iconos inline-icon btn-img material-icons" title="Agregar a la lista">save_alt</span>
                                        <span @click="crDescartar()" class="iconos inline-icon btn-img material-icons" title="Descartar">clear</span>                                    
                                    </td>
                                </tr>
                                <!-- SEGUNDO RENGLON -->
                                <tr>
                                    <td>
                                        <div class="input-group addon">
                                            <label for="refOrdenar">Ordenar por esta columna:</label>
                                            <label class="content-input">
                                                <input ref="refcrOrdenar" id="refcrOrdenar" type="checkbox" v-model="crOrdenarColumna">
                                                <i></i>
                                            </label>                                              
                                        </div>
                                    </td> 
                                    <td>
                                        <div class="input-group addon">
                                            <label for="refFiltrar">Filtrar por esta columna:</label>
                                            <label class="content-input">
                                                <input ref="refcrFiltrar" id="refcrFiltrar" type="checkbox" v-model="crFiltrarColumna">
                                                <i></i>
                                            </label>                                              
                                        </div>
                                    </td>                                     
                                    <td class="text-end" style="color:red;">
                                        {{crMensaje}}
                                    </td>
                                </tr>                                
                            </table>

                        </div>

                        <!-- LISTA DE COLUMNAS -->
                        <div class="tableFixHead table-responsive" style="height:auto;">
                        <table >
                            <thead>
                                <th>T&iacute;tulo</th>
                                <th>Campo</th>
                                <th>Ordenar</th>
                                <th>filtrar</th>
                                <th></th>
                            </thead>
                            <tr v-for="registro of modelo.oCRUD00.Columnas" :key="registro.id">
                                <td>{{registro.titulo}}</td>
                                <td>{{registro.campo}}</td>
                                <td>
                                    <span v-if="registro.ordenar == true">Si</span>
                                    <span v-if="registro.ordenar == false">No</span>
                                </td>
                                <td>
                                    <span v-if="registro.filtrar == true">Si</span>
                                    <span v-if="registro.filtrar == false">No</span>
                                </td>
                                <td>
                                    <span @click="crQuitar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Eliminar de la lista">delete</span>
                                    <span @click="crEditar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Editar este registro">mode_edit</span>
                                </td>
                            </tr>

                        </table>
                        </div>

                        <div class="btn-img float-right">
                            <h3 class="float-right">Otros datos</h3>
                        </div>
                        <div class="tableFixHead table-responsive" style="height:auto;">
                        <table>
                            <tr>
                                <td>
                                    <div class="input-group addon">
                                        <label for="refcrEditar">Editar los datos de este registro:</label>
                                        <label class="content-input">
                                            <input ref="refcrEditar" id="refcrEditar" type="checkbox" v-model="modelo.oCRUD00.Row_editar">
                                            <i></i>
                                        </label>                                              
                                    </div>
                                </td> 
                                <td>
                                    <div class="input-group addon">
                                        <label for="refEliminar">Eliminar los datos de este registro:</label>
                                        <label class="content-input">
                                            <input ref="refcrEliminar" id="refcrEliminar" type="checkbox" v-model="modelo.oCRUD00.Row_eliminar">
                                            <i></i>
                                        </label>                                              
                                    </div>
                                </td>      
                                <td>
                                    <div class="input-group addon">
                                        <label for="refcrListar">Listar los registros (Excel):</label>
                                        <label class="content-input">
                                            <input ref="refcrListar" id="refcrListar" type="checkbox" v-model="modelo.oCRUD00.btn_Listar">
                                            <i></i>
                                        </label>                                              
                                    </div>
                                </td>           

                            </tr>                                
                        </table>   
                        </div>  

                        <!-- /////////////////////////////////////////////////////////////////////////////////// -->
                        <!-- SEGUNDO PASO -->
                        <!-- /////////////////////////////////////////////////////////////////////////////////// -->

                        <div class="btn-img float-right">
                            <h3 class="float-right">Paso 2 (Edición de un registro)</h3>
                            <span class="material-icons">radio_button_unchecked</span>
                        </div>         

                        <!-- TABLA -->
                        <table>
                            <tr>
                                <td class="text-start" style="width:20%;">
                                    <label>(*) Tabla principal:</label>
                                </td>
                                <td class="text-start" style="width:60%;">
                                    <select ref="cr1Tabla" class="w-100 form-select" v-model="modelo.oCRUD01.tabla" @change="cr1CambioTabla()"> 
                                        <option v-for="q of aTablas" :key="q.id" :disabled="q.id=='0'" :value="q.id">{{q.id}} {{q.descripcion}}</option>
                                    </select>
                                </td>
                                <td class="text-start"  style="width:20%;">
                                </td>
                            </tr>

                        </table>

                        <div class="btn-img float-right" @click="cr1_expanded = !cr1_expanded">
                            <h3 class="float-right">Campos</h3>
                            <span v-if="cr1_expanded == false" class="material-icons">add_circle_outline</span>
                            <span v-if="cr1_expanded == true" class="material-icons">remove_circle_outline</span>
                        </div>

                        <div v-if="cr1_expanded">     

                            <table>
                                <!-- PRIMER RENGLON -->
                                <tr>
                                    <!-- CAMPO NOMBRE -->
                                    <td class="w-60">
                                        <div class="text-left input-group addon">
                                            <label>(*) Campo:</label>
                                            <!-- <select ref="refcr1Tabla" class="form-select" v-model="cr1Tabla">
                                                <option v-for="q of aCampos" :key="q.id" :disabled="q.id=='0'" :value="q.descripcion">{{q.descripcion}}</option>
                                            </select>         -->
                                        </div>                            
                                    </td>   
                                    <!-- CAMPO -->
                                    <td class="w-30">
                           
                                    </td> 

                                    <!-- TITULO -->
                                    <td class="w-30">

                                    </td>
                                    <!-- BOTONES -->
                                    <td class="w-10">
                                        <span @click="cr1Agregar()" class="iconos inline-icon btn-img material-icons" title="Agregar a la lista">save_alt</span>
                                        <span @click="cr1Descartar()" class="iconos inline-icon btn-img material-icons" title="Descartar">clear</span>                                    
                                    </td>
                                </tr>

                            </table>

                        </div>

                        <!-- LISTA DE CAMPOS CRUD01 -->
                        <div class="tableFixHead table-responsive" style="height:auto;">
                        <table >
                            <thead>
                                <th>T&iacute;tulo</th>
                                <th>Campo</th>
                                <th>Ordenar</th>
                                <th>filtrar</th>
                                <th></th>
                            </thead>
                            <tr v-for="registro of modelo.oCRUD01.campos" :key="registro.id">
                                <td>{{registro.titulo}}</td>
                                <td>{{registro.campo}}</td>
                                <td>
                                    <span v-if="registro.ordenar == true">Si</span>
                                    <span v-if="registro.ordenar == false">No</span>
                                </td>
                                <td>
                                    <span v-if="registro.filtrar == true">Si</span>
                                    <span v-if="registro.filtrar == false">No</span>
                                </td>
                                <td>
                                    <span @click="crQuitar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Eliminar de la lista">delete</span>
                                    <span @click="crEditar(registro.id)" class="iconos inline-icon btn-img material-icons" title="Editar este registro">mode_edit</span>
                                </td>
                            </tr>

                        </table>
                        </div>

                    </form>

                </div>

            </div>
            </div>

        </div>

        <!-- CAPTURA DE DATOS -->
        <div id="datos-cdatos" class="container-fluid tab-pane fade " :class="{show : tab == 5, active : tab == 5}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Informar datos</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                    </form>

                </div>

            </div>
            </div>

        </div>        

        <!-- LISTADO O INFORME -->
        <div id="datos-listado" class="container-fluid tab-pane fade " :class="{show : tab == 6, active : tab == 6}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Listado / Informe</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                    </form>

                </div>

            </div>
            </div>

        </div>  

        <!-- BUSCADOR -->
        <div id="datos-buscador" class="container-fluid tab-pane fade " :class="{show : tab == 7, active : tab == 7}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Buscador</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                    </form>

                </div>

            </div>
            </div>

        </div>  

        <!-- SELECTOR -->
        <div id="datos-selector" class="container-fluid tab-pane fade " :class="{show : tab == 8, active : tab == 8}"><br>

            <div class="row justify-content-center">
            <div class="card" style="width: 90%;">

                <div class="card-header">
                    <h3>Selector</h3>
                </div>
                <div class="card-body">

                    <form action @submit.prevent="cero">

                    </form>

                </div>

            </div>
            </div>

        </div>  

    </div> 

</div>
</template>

<script>

import datos from '@/utils/datos'
import funciones from '@/utils/funciones'
import telon from '@/components/visuales/telon'

export default {
    name: 'NewScreen',
    data() {
        return {
            tab: 1,
            hiddentelon: true,
            claveId: '',
            errores: [], error_grave: 0, error_warning: 0,
            E_expanded: false,
            dTipos: [
                {id: '0', literal: "Selecciona ..."},
                {id: 'G', literal: "Tabla de gestiones"},
                {id: 'C', literal: "CRUD (create, read, update, delete)"},
                {id: 'D', literal: "Informar datos"},
                {id: 'I', literal: "Listado o Informe"},
                {id: 'B', literal: "Buscador"},
                {id: 'S', literal: "Selector"},
            ],
            aQuerys: [],
            aTablas: [],
            aCampos: [],
            // Tabla de gestion
            tgidQueryOld: '0',
            tg_id: funciones.generarUUID2(),
            tg_expanded: false,
            tgMensaje: '',
            tgCadenaSQL: '',
            tgTituloColumna: '',
            tgCampoColumna: '',
            tgOrdenarColumna: '',
            tgFiltrarColumna: '',
            // CRUD
            cridQueryOld: '0',
            cr_id: funciones.generarUUID2(),
            cr_expanded: false,
            crMensaje: '',  
            crCadenaSQL: '',
            crTituloColumna: '',
            crCampoColumna: '',
            crOrdenarColumna: '',
            crFiltrarColumna: '',
            // CRUD
            cr1_id: funciones.generarUUID2(),
            cr1_expanded: false,
            cr1Mensaje: '',  
            cr1Campo: '0',
            cr1Etiqueta: '',
            cr1Formato: '0',
            cr1EnabledInicial: false,            
            // Modelo de la pantalla            
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
                },
                oTablaGestiones: {
                    idQuery: '0',
                    Columnas: [],
                    Row_editar: false,
                    Row_eliminar: false,
                },
                oCRUD00: {
                    idQuery: '0',
                    Columnas: [],
                    Row_editar: false,
                    Row_eliminar: false,
                    btn_Listar: false
                },
                oCRUD01: {
                    tabla: '0',
                    Campos: [],

                }                
            }

            
        }
    },
    components:{
        telon,
    },
    methods: {
        cero(e) {
            e.preventDefault();
        },  
        enfocar(referencia, tabulacion) {
            this.tab = tabulacion;
            if(referencia != null) {
                this.$nextTick(() => {
                    this.$refs[referencia].focus();
                })
            }

        },        
        errDescripcion(pCodigo, que) {
            let err = funciones.tablaErrores(pCodigo);
            if(que == 'L')
                return err.literal;

            if(que == 'C')
                return err.criticidad;

        },              
        LeerDatos() {

            try {

                this.hiddentelon = false;

                datos.leerLista('sys_screens', "id='" + this.claveId + "'", ['objeto'], '')
                .then((result) => {

                    if(result.success == 1 && result.status == 200) {
                        this.modelo = JSON.parse(result.data[0].objeto.split('&quot;').join('"'));

                        if(this.modelo.oDisenio.tipo == 'G' && this.modelo.oTablaGestiones.idQuery != '0') {
                            this.cargaCamposConsulta(this.modelo.oTablaGestiones.idQuery);
                        }
                        if(this.modelo.oCRUD00.idQuery) {
                        if(this.modelo.oDisenio.tipo == 'C' && this.modelo.oCRUD00.idQuery != '0') {
                            this.cargaCamposConsulta(this.modelo.oCRUD00.idQuery);
                        }
                        }   

                    }
                }).finally(() => {
                    this.hiddentelon = true;              
                })

            } catch(error) {
                console.log(error);
            }

        },
        async Validaciones() {

            this.errores = [];
            this.error_grave = 0;
            this.error_warning = 0;

            // Limpiar los objetos que no aplican
            // switch(this.modelo.oDatosGenerales.tipo) {
            // case 'L':
            //     this.modelo.oTablaGestion.nombre = '';
            //     this.modelo.oTabla.oCampos = [];
            //     this.modelo.oQuery.cadenaSQL = '';
            //     this.modelo.oQuery.oFiltros = [];
            //     this.modelo.oSelectable.idQuery = '';
            //     this.modelo.oSelectable.campo_codigo = '';
            //     this.modelo.oSelectable.campo_valor = '';
            //     this.modelo.oSelectable.campo_descripcion = '';     
            //     break;   
                
            // }


            // Datos generales
            if(this.modelo.oDatosGenerales.titulo == '') {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e001' Falta rellenar el campo
                    descripcion: "No has indicado el título para la definición",
                    ref: 'scrTitulo',
                    tab: 1
                })
                this.error_grave++;
            }
            if(this.modelo.oDatosGenerales.version == 0) {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e001' Falta rellenar el campo
                    descripcion: "No has indicado el número de versión",
                    ref: 'scrVersion',
                    tab: 1
                })
                this.error_grave++;
            }

            // Diseño
            if(this.modelo.oDisenio.titulo == '') {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e001' Falta rellenar el campo
                    descripcion: "No has indicado el título para la pantalla",
                    ref: 'scrDisenioTitulo',
                    tab: 2
                })
                this.error_grave++;
            }            
            if(this.modelo.oDisenio.tipo == 0) {
                this.errores.push({
                    idx: this.errores.length + 1,
                    codigo: 'e001',   // 'e001' Falta rellenar el campo
                    descripcion: "No has indicado el tipo de pantalla",
                    ref: 'scrTipo',
                    tab: 2
                })
                this.error_grave++;
            }
            // Tabla de gestiones            
              
            // CRUD




            // *************************************************************************************** //                        
            if(this.error_grave == 0 && this.error_warning == 0) {
                this.E_expanded = false;
            }

        },
        Grabar() {

            this.Validaciones()
            .then(() => {

                // Hay errores
                if(this.error_grave > 0) {
                    funciones.popAlert('error', 'Hay errores que no permiten guardar', true, false, 8000, "Ok")
                    .then(() => {
                        return;
                    })
                } else if (this.error_warning > 0) {

                    funciones.popAlert('warning', 'Faltan datos importantes, quieres continuar?', true, true, 8000, "Sí")
                    .then((result) => {

                        if(result==true) {

                            // Con warning - Guardar
                            if(this.claveId == null) {
                                // Almacenar nuevo 
                                this.Agregar();
                            } else {    
                                // Actualizar claveId
                                this.Actualizar();
                            }

                        }
                    
                    })

                } else {

                    // Sin errores - Guardar
                    funciones.popAlert('question', 'Quieres guardar la definición de la pantalla?', true, true, 8000, "Sí")
                    .then((result) => {

                        if(result==true) {

                            if(this.claveId == null) {
                                // Almacenar nuevo documento
                                this.Agregar();
                            } else {    
                                // Actualizar el documento claveId
                                this.Actualizar();
                            }
                            
                        }
                    })

                }

            })

        },
        Agregar() {

            try{

                this.hiddentelon = false;

                let tmp = this.modelo;
                let almacenar = "";

                // Almacenar nueva definición 
                almacenar = {
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

                        funciones.popAlert("success", "Datos almacenados!", true, false, 3000, "ok")
                        .then(() => {
                            this.$router.push('/inicio');
                        })

                    } else {
                        funciones.popAlert("error", "No se ha podido grabar en este momento! (ce001)", true, false, 3000, "ok");
                    }

                }).finally(() => {
                    this.hiddentelon = true;              
                })

            } catch (error) {
                console.log(error);
            }            

        },
        Actualizar() {

           try {

                let tmp = this.modelo;
                let almacenar = "";

                // Actualizar las propiedades de la pantalla
                almacenar = {
                    id:      tmp.oDatosGenerales.screenId, 
                    titulo:  tmp.oDatosGenerales.titulo, 
                    version: tmp.oDatosGenerales.version,
                    tipo:    tmp.oDisenio.tipo,
                    activa:  tmp.oDatosGenerales.activa, 
                    objeto:  JSON.stringify(this.modelo, null, '\t')
                };               
                datos.actualizarScreen("id='" + tmp.oDatosGenerales.screenId + "'", almacenar)
                .then((result) => {

                    if(result.success == 1 && result.status == 200) {

                        funciones.popAlert("success", "Datos actualizados!", true, false, 3000, "ok")
                        .then(() => {
                            this.$router.push('/inicio');
                        });

                    } else {
                        funciones.popAlert("error", "No se ha podido grabar en este momento! (ce001)", true, false, 3000, "ok");
                    }

                }).finally(() => {
                    this.hiddentelon = true;              
                })

            } catch (error) {
                console.log(error);
            }

        },
        leerListadeQuerys() {

            try {

                this.aQuerys = [{
                    clave: '0',
                    id: '0',
                    descripcion: 'Selecciona una consulta ...'                    
                }];

                datos.leerLista("sys_modelo_datos", "tipo='Q'", ["clave","id", "descripcion"], "descripcion")
                .then((result) => {

                    if(global.DEBUG)
                        console.log("leerListadeQuerys", "datos devueltos datos.leerListadeQuerys", result);

                    if(result.success == 1 && result.status == 200) {

                        for(let x = 0; x < result.data.length; x++) {
                            this.aQuerys.push({
                                clave: result.data[x].clave,
                                id: result.data[x].id,
                                descripcion: result.data[x].descripcion
                            })
                        }

                    }
                })

            } catch(error) {
                console.log(error);
            }

        },
        leerListadeTablas() {

            try {

                this.aTablas = [{
                    clave: '0',
                    id: '0',
                    descripcion: 'Selecciona la tabla principal ...'                    
                }];

                datos.leerLista("sys_modelo_datos", "tipo='T'", ["clave","id", "descripcion"], "descripcion")
                .then((result) => {

                    if(global.DEBUG)
                        console.log("leerListadeTablas", "datos devueltos datos.leerListadeTablas", result);

                    if(result.success == 1 && result.status == 200) {

                        for(let x = 0; x < result.data.length; x++) {
                            this.aTablas.push({
                                clave: result.data[x].clave,
                                id: result.data[x].id,
                                descripcion: result.data[x].descripcion
                            })
                        }

                    }
                })

            } catch(error) {
                console.log(error);
            }

        },
        CargaConsulta(pId) {

            this.hiddentelon = false;   

            try {

                datos.leerLista('sys_modelo_datos', "id='" + pId + "'", ['objeto'], '')
                .then((result) => {

                    if(result.success == 1 && result.status == 200) {

                        let tmp_modelo = JSON.parse(result.data[0].objeto.split('&quot;').join('"'));

                        if(this.modelo.oDisenio.tipo == 'G') {
                            this.tgCadenaSQL = tmp_modelo.oQuery.cadenaSQL;
                        }
                        if(this.modelo.oDisenio.tipo == 'C') {
                            this.crCadenaSQL = tmp_modelo.oQuery.cadenaSQL;
                        }

                    }

                }).finally(() => {
                    this.hiddentelon = true;              
                })
                
            } catch(error) {
                console.log(error);
            }

        },
        cargaCamposConsulta(pId) {

            this.aCampos = [{
                id: '0',
                descripcion: 'Selecciona un campo ...'
            }];

            if(pId == '0') {
                return;
            }

            this.hiddentelon = false;   

            try {

                datos.leerLista('sys_modelo_datos', "id='" + pId + "'", ['objeto'], '')
                .then((result) => {

                    if(result.success == 1 && result.status == 200) {

                        // Recuperar la cadena de la consulta
                        let tmp_modelo = JSON.parse(result.data[0].objeto.split('&quot;').join('"'));
                        let tmp_CadenaSQL = tmp_modelo.oQuery.cadenaSQL;

                        // Hacer el parse de los campos de la consulta
                        funciones.parseSQL(tmp_CadenaSQL)
                        .then((result) => {

                            if(result.success == 1 && result.status == 200) {

                                for(let x=0; x < result.data.SELECT.length; x++) {
                                    if(result.data.SELECT[x].base_expr != '*') {
                                        this.aCampos.push({
                                            id: x + 1,
                                            descripcion: result.data.SELECT[x].base_expr
                                        })
                                    }
                                }

                            }

                        })

                    }

                }).finally(() => {
                    this.hiddentelon = true;              
                })
                
            } catch(error) {
                console.log(error);
            }


        },
        cargaCamposTabla(pId) {

            this.aCampos = [{
                id: '0',
                descripcion: 'Selecciona un campo ...'
            }];

            if(pId == '0') {
                return;
            }

        },     
        // LISTA DE VALORES        
        tgVaciarColumnas() {

            if(this.modelo.oTablaGestiones.Columnas.length > 0) {
                funciones.popAlert('warning', 'Se perderá la definición de las columnas!', false, true, 3000, 'Ok')
                .then(() => {

                    this.modelo.oTablaGestiones.Columnas = [];
                    return true;

                });
            } else {
                return true;
            }

        },            
        tgDescartar() {
            this.tg_id = funciones.generarUUID2();
            this.tgTituloColumna = '';
            this.tgCampoColumna = '';
            this.tgOrdenarColumna = false;
            this.tgFiltrarColumna = false,
            
            this.tgMensaje = "";
            this.$refs.refTituloColumna.focus();

        },
        tgAgregar() {

            let editando = this.modelo.oTablaGestiones.Columnas.findIndex(x => x.id === this.tg_id);

            if(this.tgTituloColumna == '' || this.tgCampoColumna == '') {
                this.tgMensaje = "Faltan datos";
                this.$refs.refTituloColumna.focus();
                return;
            }

            if(editando == -1) {
                this.modelo.oTablaGestiones.Columnas.push({
                    id: this.tg_id,
                    titulo: this.tgTituloColumna,
                    campo: this.tgCampoColumna,
                    ordenar: this.tgOrdenarColumna,
                    filtrar: this.tgFiltrarColumna

                })
            } else {
                this.modelo.oTablaGestiones.Columnas[editando].titulo = this.tgTituloColumna;
                this.modelo.oTablaGestiones.Columnas[editando].campo = this.tgCampoColumna;
                this.modelo.oTablaGestiones.Columnas[editando].ordenar = this.tgOrdenarColumna;
                this.modelo.oTablaGestiones.Columnas[editando].filtrar = this.tgFiltrarColumna;
            }

            this.tgDescartar();

        },
        tgQuitar(pId) {

            this.modelo.oTablaGestiones.Columnas = this.modelo.oTablaGestiones.Columnas.filter((tx) => {
                return tx.id != pId; 
            }) 

        },
        tgEditar(pId) {

            let idx = this.modelo.oTablaGestiones.Columnas.findIndex(x => x.id === pId);

            this.tg_expanded = true;

            this.tg_id = pId;
            this.tgTituloColumna = this.modelo.oTablaGestiones.Columnas[idx].titulo;
            this.tgCampoColumna = this.modelo.oTablaGestiones.Columnas[idx].campo;
            this.tgOrdenarColumna = this.modelo.oTablaGestiones.Columnas[idx].ordenar;
            this.tgFiltrarColumna = this.modelo.oTablaGestiones.Columnas[idx].filtrar;

        },
        tgCambioQuery() {

            if(this.modelo.oTablaGestiones.Columnas.length > 0) {
                funciones.popAlert('warning', 'Se perderá la definición de las columnas!', true, true, 3000, 'Continuar?')
                .then((result) => {
                    if(result == true) {
                        this.modelo.oTablaGestiones.Columnas = [];
                        this.tgCadenaSQL='';
                        this.tgidQueryOld = this.modelo.oTablaGestiones.idQuery;
                        this.cargaCamposConsulta(this.modelo.oTablaGestiones.idQuery);
                        return true;
                    } else {
                        this.modelo.oTablaGestiones.idQuery = this.tgidQueryOld;
                        return false;
                    }
                });
            } else {
                this.modelo.oTablaGestiones.Columnas = [];
                this.tgCadenaSQL='';
                this.tgidQueryOld = this.modelo.oTablaGestiones.idQuery;
                this.cargaCamposConsulta(this.modelo.oTablaGestiones.idQuery);
                return true;
            }

        },     
        // CRUD00
        crVaciarColumnas() {

            if(this.modelo.oCRUD00.Columnas.length > 0) {
                funciones.popAlert('warning', 'Se perderá la definición de las columnas!', false, true, 3000, 'Ok')
                .then(() => {

                    this.modelo.oCRUD00.Columnas = [];
                    return true;

                });
            } else {
                return true;
            }

        },            
        crDescartar() {
            this.cr_id = funciones.generarUUID2();
            this.crTituloColumna = '';
            this.crCampoColumna = '';
            this.crOrdenarColumna = false;
            this.crFiltrarColumna = false,
            
            this.crMensaje = "";
            this.$refs.refcrTituloColumna.focus();

        },
        crAgregar() {

            let editando = this.modelo.oCRUD00.Columnas.findIndex(x => x.id === this.cr_id);

            if(this.crTituloColumna == '' || this.crCampoColumna == '') {
                this.crMensaje = "Faltan datos";
                this.$refs.refcrTituloColumna.focus();
                return;
            }

            if(editando == -1) {
                this.modelo.oCRUD00.Columnas.push({
                    id: this.cr_id,
                    titulo: this.crTituloColumna,
                    campo: this.crCampoColumna,
                    ordenar: this.crOrdenarColumna,
                    filtrar: this.crFiltrarColumna

                })
            } else {
                this.modelo.oCRUD00.Columnas[editando].titulo = this.crTituloColumna;
                this.modelo.oCRUD00.Columnas[editando].campo = this.crCampoColumna;
                this.modelo.oCRUD00.Columnas[editando].ordenar = this.crOrdenarColumna;
                this.modelo.oCRUD00.Columnas[editando].filtrar = this.crFiltrarColumna;
            }

            this.crDescartar();

        },
        crQuitar(pId) {

            this.modelo.oCRUD00.Columnas = this.modelo.oCRUD00.Columnas.filter((tx) => {
                return tx.id != pId; 
            }) 

        },
        crEditar(pId) {

            let idx = this.modelo.oCRUD00.Columnas.findIndex(x => x.id === pId);

            this.cr_expanded = true;

            this.cr_id = pId;
            this.crTituloColumna = this.modelo.oCRUD00.Columnas[idx].titulo;
            this.crCampoColumna = this.modelo.oCRUD00.Columnas[idx].campo;
            this.crOrdenarColumna = this.modelo.oCRUD00.Columnas[idx].ordenar;
            this.crFiltrarColumna = this.modelo.oCRUD00.Columnas[idx].filtrar;

        },        
        crCambioQuery() {

            if(this.modelo.oCRUD00.Columnas.length > 0) {
                funciones.popAlert('warning', 'Se perderá la definición de las columnas!', true, true, 3000, 'Continuar?')
                .then((result) => {
                    if(result == true) {
                        this.modelo.oCRUD00.Columnas = [];
                        this.crCadenaSQL='';
                        this.cridQueryOld = this.modelo.oCRUD00.idQuery;
                        this.cargaCamposConsulta(this.modelo.oCRUD00.idQuery);
                        return true;
                    } else {
                        this.modelo.oCRUD00.idQuery = this.cridQueryOld;
                        return false;
                    }
                });
            } else {
                this.modelo.oCRUD00.Columnas = [];
                this.crCadenaSQL='';
                this.cridQueryOld = this.modelo.oCRUD00.idQuery;
                this.cargaCamposConsulta(this.modelo.oCRUD00.idQuery);
                return true;
            }

        },   
        // CRUD01
        cr1CambioTabla() {

        }



        
    },
    mounted(){
        this.claveId = this.$route.params['p_claveId'];
        if(this.claveId != null) {
            this.LeerDatos();
        }
        this.leerListadeQuerys();
        this.leerListadeTablas();
        
    },

}

</script>
