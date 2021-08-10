require('../config/lib')
require('../config/global')

const router = express.Router();
const { info } = require('winston');
const cvmData = require('../database/get_dn');
const middleware = require('../method/test_api_m');

router.use(middleware)

router.get("/v1/get_data_customer", async function (req, res) {
    try {
        let data = req.query
        const cvm_id = data.cvm_id
        var json_data = req.json_data
        const dbconfig = json_data.db_connect
        const type_api = 'paperless'
        result_select = await cvmData.select_data_form_cvm(cvm_id, dbconfig, type_api)
        if (result_select[0]) {
            return res.status(200).json({
                status: true,
                message: 'success',
                data: result_select[1]
            })
        } else {
            throw ({
                message: result_select[1]
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: false,
            message: error.message,
            data: null
        })
    }

});

module.exports = router