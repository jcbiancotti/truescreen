import global from '@/utils/global'
import axios from 'axios'

export default {

    async existe (pCorreo) {

        // Comprueba se el correo existe en la tabla de usuarios
        // correo: correo@ejemplo.com

        if(global.DEBUG)
            console.log("datos.existe", "parametros", pCorreo);

        // No requiere el token
        let resultado = await axios.post(global.ENDPOINT_PATH + "auth/existe.php", {'correo': pCorreo});

        if(global.DEBUG)
            console.log("datos.existe", "datos devueltos back", resultado);

        return resultado.data;

    },
    async leerLista(pTabla, pClave, pModelo, pOrden) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        // Objeto consulta
        let consulta = 
        {
            "operacion":"READ",
            "tabla":pTabla,
            "clave":pClave,
            "modelo":pModelo,
            "orden":pOrden
        }        
        let resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', consulta, opciones);
            
        if(global.DEBUG)
            console.log("datos.leerLista", "datos devueltos back", resultado);
    
        return resultado.data;          
            
    },
    async grabarScreen(pObjeto) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        let envio = {
            "operacion":"ADD",
            "tabla":'sys_screens',
            "modelo": ["id", "titulo", "version", "tipo", "activa", "objeto"],
            "objeto": pObjeto
        }    
        let resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', envio, opciones);
 
        if(global.DEBUG)
            console.log("datos.grabarScreen", "datos devueltos back", resultado);
    
        return resultado.data;          
            
    },    
    async actualizarScreen(pClave, pObjeto) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        let envio = {
            "operacion":"UPDATE",
            "tabla": 'sys_screens',
            "clave": pClave,
            "modelo": ["id", "titulo", "version", "tipo", "activa", "objeto"],
            "objeto": pObjeto
        }    
        let resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', envio, opciones);
 
        if(global.DEBUG)
            console.log("datos.actualizarScreen", "datos devueltos back", resultado);
    
        return resultado.data;          
            
    },
    async borrarScreen(pClave) {

        let opciones = { 'headers': { 'Authorization': 'Bearer ' + localStorage.token} };

        let envio = {
            "operacion":"DELETE",
            "tabla": 'sys_screens',
            "clave": pClave,
        }    
        let resultado = await axios.post(global.ENDPOINT_PATH + 'datos/data_manager.php', envio, opciones);
 
        if(global.DEBUG)
            console.log("datos.borrarScreen", "datos devueltos back", resultado);
    
        return resultado.data; 

    }




}