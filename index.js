const AWS = require('aws-sdk');
const pg = require("pg");
AWS.config.update({ region: 'us-west-2' });


let dbConfig = {
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    host: process.env.host,
    port: process.env.post
};



exports.handler = async (event, context, callback) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Inital Response'),
    };
    const body_params = {}
    const page = event['page']
    const itemsPerPage = event['itemsPerPage']
    let orderBy = event['orderBy'] || 'ASC'
    orderBy = orderBy === 'ASC' ? orderBy : orderBy === 'DESC' ? orderBy : 'ASC'

    const fieldName = event['fieldName'] || 'request_id'
    body_params.page = page;
    body_params.itemsPerPage = itemsPerPage;


    try {
        if (page && page != '') {
            if (!Number.isInteger(page)) {
                callback(new Error(`Page is not Interger type`));

            }
        }
        if (itemsPerPage && itemsPerPage != '') {
            if (!Number.isInteger(itemsPerPage)) {
                callback(new Error(`itemsPerPage is not Interger type`));
                return
            }
        }


        // let offset_de = (body_params.page - 1) * body_params.itemsPerPage;
        // let limit = body_params.itemsPerPage;
        // const constructQuery = {
        //     name: 'vehicleData',
        //     text: 'select * from apv_ive.VEHICLE_DATA_REQUEST_INFO limit $1 offset $2 ORDER BY $3 $4',
        //     values: [body_params.itemsPerPage, offset_de, fieldName, orderBy]
        // }

        const query1 = itemsPerPage ?
            `select * from apv_ive.VEHICLE_DATA_REQUEST_INFO  ORDER BY ${fieldName} ${orderBy} limit ${body_params.itemsPerPage} offset ${(body_params.page - 1) * body_params.itemsPerPage}`
            : `select * from apv_ive.VEHICLE_DATA_REQUEST_INFO ORDER BY ${fieldName} ${orderBy} `

        const getData = params => new Promise((resolve, reject) => {
            const pool = new pg.Pool(dbConfig);
            pool.connect(function (err, client, done) {
                if (err) {
                    reject(err.stack)
                    throw Error(err)
                } else {

                    client.query(query1, (err, result) => {
                        if (err) {
                            reject(err.stack)
                            throw Error(err)
                        } else {
                            resolve(result.rows)

                        }
                        client.release();


                    });
                    pool.end()
                }

            });
        })
        const fetch_data = await getData();
        response.statusCode = 200;
        response.body = fetch_data;
        console.info('Ending lambda at ' + new Date());
        return response;

    } catch (error) {
        console.error(error, 'error cought in catch')
        return error;

    }

};

