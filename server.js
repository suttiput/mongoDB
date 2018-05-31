const Hapi = require('hapi');
const Boom = require('boom');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');



const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});
const launchServer = async function() {

    const dbOpts = {
        url: 'mongodb://localhost:8888/customers',
        settings: {
            poolSize: 10
        },
        decorate: true
    };

    const swaggerOptions = {
        info: {
            title: 'BALLZA555+',
            version: Pack.version,
        },
    };
    await server.register([{
            plugin: require('hapi-mongodb'),

            options: dbOpts
        },
        require('Inert'),
        require('Vision'), {
            plugin: HapiSwagger,
            options: swaggerOptions
        }

    ]);

    server.route({
        method: 'GET',
        path: '/',
        config: {
            tags: ['api'],
            async handler(request) {


                const db = request.mongo.db;
                const ObjectID = request.mongo.ObjectID;
                console.log(request)
                try {
                    const result = await db.collection('customers').find().toArray();
                    return result;
                } catch (err) {
                    throw Boom.internal('Internal MongoDB error', err);
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/add',
        config: {
            tags: ['api'],

            async handler(request) {
                const db = request.mongo.db;
                console.log(request)
                try {
                    const result = await db.collection('customers').insert(request.payload);
                    return result;
                } catch (err) {
                    throw Boom.internal('Internal MongoDB error', err);
                }
            }
        },
    });
    server.route({
        method: 'PUT',
        path: '/put/{id}',
        config: {
            tags: ['api'],

            async handler(request) {
                const db = request.mongo.db;
                const ObjectID = request.mongo.ObjectID;

                console.log(request)
                try {
                    const result = await db.collection('customers').update({ _id: new ObjectID(request.params.id) }, request.payload);
                    return result;
                } catch (err) {
                    throw Boom.internal('Internal MongoDB error', err);
                }
            }
        },
    });
    server.route({
        method: 'DELETE',
        path: '/delete/{id}',
        config: {
            tags: ['api'],

            async handler(request) {
                const db = request.mongo.db;
                const ObjectID = request.mongo.ObjectID;


                console.log(request)
                try {
                    const result = await db.collection('customers').remove({ _id: new ObjectID(request.params.id) });
                    return result;
                } catch (err) {
                    throw Boom.internal('Internal MongoDB error', err);
                }
            }
        },
    });


    await server.start();
    console.log()
    console.log(`ser ${server.info.uri}`);

};

launchServer().catch((err) => {
    console.error(err);
    process.exit(1);
});