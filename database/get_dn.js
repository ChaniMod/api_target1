require("../config/lib")
const {querySql} = require("../config/oracle_db")


async function select_data_form_cvm(cvm_id, json_data,type_api) {
    try {
        var sql_text = null
        if (type_api === 'target'){
            sql_text = {
                sql:`select * from sajet.cus_shipping_no_info`,
                values:[cvm_id]
            }
        }else{
            sql_text = {
                sql:`select * from sajet.cus_shipping_no_info`,
                values:[cvm_id,cvm_id]
            }
        }
        result_query = await querySql(json_data,sql_text)
        if (result_query.length !== 0) {
            if (result_query[0].Address==null){
                result_query[0].Address = ''
            }
            return [true,result_query[0]]
        }else {
            return [false,'data not found']
        }
    } 
    catch (err) {
        console.log(err)
        return [false,err]
    } 
}

module.exports = {
    select_data_form_cvm
}