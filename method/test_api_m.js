require('../config/lib')
require('../config/global')

const contactdetailsdb = require('../database/get_dn')

async function add_update_cvmdata(json_data,datacvm,type_data){
    try {
        const len_key = Object.keys(datacvm).length
        const list_key = Object.keys(datacvm)
        const key_del = ['transaction_id','createAt','updateAt']
        const type_api = 'CVM'
        const result_column = await contactdetailsdb.select_cloumname(json_data,'cus_shipping_no_info',key_del)
        if (result_column[0]){
            const key_check = result_column[1].columlist
            if(len_key!==result_column[1].len){
                let list_keynew = []
                for (i = 0; i < list_key.length; i++) {
                    if(!key_check.includes(list_key[i])){
                        list_keynew.push(list_key[i])
                    }
                }
                result = await contactdetailsdb.alter_colum(json_data,list_keynew)
            }
        }
        if (type_data==='data_contact'){
            const cvm_id = datacvm.contact_no
            const condition_update_from_cvmid = 'contact_no'
            const result_data = await contactdetailsdb.select_data_form_cvm(cvm_id,json_data,type_api)
            if (result_data[0]){
                const result_update = await contactdetailsdb.update_data_cvm(json_data,datacvm,condition_update_from_cvmid)
                if (result_update[0]){
                    return [true,"succcess"]
                }else{
                    return [false,result_update[1]]
                }
            }else{
                const result_update = await contactdetailsdb.insert_data_cvm(json_data,datacvm)
                if (result_update[0]){
                    return [true,"succcess"]
                }else{
                    return [false,result_update[1]]
                }
            }
        }else{
            const customers_id = datacvm.customers_id
            const condition_update_from_customers_id = 'customers_id'
            const result_data = await contactdetailsdb.select_data_form_cvm(customers_id,json_data,type_api)
            if (result_data[0]){
                const result_update = await contactdetailsdb.update_data_cvm(json_data,datacvm,condition_update_from_customers_id)
                if (result_update[0]){
                    return [true,"succcess"]
                }else{
                    return [false,result_update[1]]
                }
            }else{
                return [false,result_data[1]]
            }
        }
    } catch (error) {
        console.log(error)
        return [false,error]
    }
}

module.exports = {
    add_update_cvmdata
}