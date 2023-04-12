<script>

const EMPRESA = 'True Software España';
const PRODUCCION = true;
let ENDPOINT_PATH;
const DEBUG = true;
let usuario = {
    logged: false,
    userId: 0,
    userEmail: '',
    userName: '',
    userFullName: '',
    userRoles: [],
}        

if(PRODUCCION == true) {
    ENDPOINT_PATH = 'https://www.biancotti.es/Backend22/';
} else {
    ENDPOINT_PATH = 'http://localhost/Backend22/';
}

export default
{
    PRODUCCION,
    ENDPOINT_PATH,
    DEBUG,
    EMPRESA,
    usuario,

}
 </script> 
