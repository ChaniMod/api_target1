const express = require('express')
const app = express()
const appConfig = require('./config/app');
const PORT = process.env.PORT || 8080
var oracledb = require('oracledb');
var mypw = "tech"

async function run() {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "sajet",
      password      : mypw,
      connectString : "10.80.10.18/mesdb"
    });

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
    if (result.rows.length == 0) {
      return res.send('query send no rows');
    } else {
      return res.send(result.rows);
    }
  }
}

app.get('/target_l4', function (req, res) {
  // res.json({result: "OK", data:[1,2,3,4,5]})
  getAllTarget(req, res);
  // console.log('mod')
  // try {
  //   let data = req.query
  //   var json_data = req.json_data
  //   const dbconfig = json_data.db_connect
  //   console.log(data)
  //   result_select = getAllTarget(dbconfig)
  //       if (result_select[0]) {
  //           return res.status(200).json({
  //               status: true,
  //               message: 'success',
  //               data: result_select[1]
  //           })
  //       } else {
  //           throw ({
  //               message: result_select[1]
  //           })
  //       }
  // } catch (error) {

  // }
})

async function getAllTarget(req, res) {
  try {
    connection = await oracledb.getConnection({
      user          : "sajet",
      password      : mypw,
      connectString : "10.80.10.18/mesdb"
    });
    result = await connection.execute(
      // `SELECT shipping_id, dn, customer_po FROM cus_shipping_no_info WHERE shipping_id = '800692888'`
      `select replace(f.process_name,'-TH','') as "Station", target_qty as "Target", out_qty as "Output", chayi_qty as "Diff.Qty",
              to_char(round(out_qty / target_qty, 4) * 100, 'FM9999999999999999.00') || '%' as "Ach.%",
              yiled || '%' as "Yiled%"
        from   (select a1.pdline_id, a1.process_id, target_qty, pass_qty + fail_qty out_qty,
                pass_qty - fail_qty - target_qty chayi_qty,
                to_char(round(pass_qty / (pass_qty + fail_qty), 4) * 100, 'FM9999999999999999.00') yiled, show_seq
              from   (select a.pdline_id, c.process_id, c.show_seq, sajet.f_get_target('day', a.pdline_id, 10000006) target_qty
                  from   sajet.g_pdline_shift_qty a, sajet.g_pdline_shift_status b, sajet.g_pdline_shift_process c
                  where  a.enabled = 'Y' and b.enabled = 'Y' and c.enabled = 'Y' and a.pdline_id = b.pdline_id and
                      a.pdline_id = c.pdline_id and a.shift_id = b.shift_id and a.shift_id = c.shift_id and
                      a.shift_id = 10000006 * sajet.f_get_dayfep('day') and a.pdline_id = 10200
                  group  by a.pdline_id, c.process_id, c.show_seq) a1,
                (select d.pdline_id, d.process_id, nvl(sum(pass_qty), 0) pass_qty, nvl(sum(fail_qty), 0) fail_qty
                  from   g_sn_count d,
                      (select distinct a.pdline_id, c.process_id
                        from   g_pdline_shift_qty a, g_pdline_shift_status b, g_pdline_shift_process c
                        where  a.enabled = 'Y' and b.enabled = 'Y' and c.enabled = 'Y' and a.pdline_id = b.pdline_id and
                          a.pdline_id = c.pdline_id and a.shift_id = b.shift_id and a.shift_id = c.shift_id and
                          a.shift_id = 10000006 * sajet.f_get_dayfep('day')) a3
                  where  create_time between sajet.f_get_timefep(null) and sajet.f_get_timefep(null) + 1 / 2 and
                      d.pdline_id = a3.pdline_id and d.process_id = a3.process_id and d.pdline_id = 10200
                                  and (d.pass_qty<>0 or d.fail_qty<>0)
                  group  by d.pdline_id, d.process_id) b1
              where  a1.pdline_id = b1.pdline_id(+) and a1.process_id = b1.process_id(+)
              union all
              select a1.pdline_id, a1.process_id, target_qty, pass_qty + fail_qty out_qty,
                pass_qty-fail_qty-target_qty chayi_qty,
                to_char(round(pass_qty / (pass_qty + fail_qty), 4) * 100, 'FM9999999999999999.00') yiled, show_seq
              from   (select a.pdline_id, c.process_id, show_seq, sajet.f_get_target('night', a.pdline_id, 10000007) target_qty
                  from   g_pdline_shift_qty a, g_pdline_shift_status b, g_pdline_shift_process c
                  where  a.enabled = 'Y' and b.enabled = 'Y' and c.enabled = 'Y' and a.pdline_id = b.pdline_id and
                      a.pdline_id = c.pdline_id and a.shift_id = b.shift_id and a.shift_id = c.shift_id and
                      a.shift_id = 10000007 * sajet.f_get_dayfep('night') and a.pdline_id = 10200
                  group  by a.pdline_id, c.process_id, show_seq) a1,
                (select d.pdline_id, d.process_id, nvl(sum(pass_qty), 0) pass_qty, nvl(sum(fail_qty), 0) fail_qty
                  from   g_sn_count d,
                      (select distinct a.pdline_id, c.process_id
                        from   g_pdline_shift_qty a, g_pdline_shift_status b, g_pdline_shift_process c
                        where  a.enabled = 'Y' and b.enabled = 'Y' and c.enabled = 'Y' and a.pdline_id = b.pdline_id and
                          a.pdline_id = c.pdline_id and a.shift_id = b.shift_id and a.shift_id = c.shift_id and
                          a.shift_id = 10000007 * sajet.f_get_dayfep('night')) a3
                  where  create_time between sajet.f_get_timefep(null) and sajet.f_get_timefep(null) + 1 / 2 and
                      d.pdline_id = a3.pdline_id and d.process_id = a3.process_id and d.pdline_id = 10200
                                  and (d.pass_qty<>0 or d.fail_qty<>0)
                  group  by d.pdline_id, d.process_id) b1
              where  a1.pdline_id = b1.pdline_id(+) and a1.process_id = b1.process_id(+)) e, sys_process f, sys_pdline g
        where  e.process_id = f.process_id and e.pdline_id = g.pdline_id
        order  by show_seq`
    );

    

  } catch (err) {
    return res.send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.close(); 
      } catch (err) {
        return console.error(err.message);
      }
    }
    if (result.rows.length == 0) {
      return res.send('query send no rows');
    } else {
      return res.send(result.rows);
    }
  }
}

app.listen(PORT, ()=>{
  console.log(`Server is runing. ${PORT}`)
})

run();