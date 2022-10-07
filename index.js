const { ApolloServer, gql } = require('apollo-server');


const db = require("./models");
db.sequelize.sync()
.then(()=> {
	console.log("sync db");
})
.catch((err)=> {
	console.log("error: " + err.message);
});

const Berita = db.berita;
const Komen1s = db.komen1s;
const Op = db.Sequelize.Op;

const resolvers = {
	Query: {	 
	  berita: () => {
		return Berita.findAll()
			.then(berita => {
				return berita;
			})
			.catch(err => {		
				return [];
		});
	  },
	  komen1s: () => {
		return Komen1s.findAll()
			.then(komen1s => {
				return komen1s;
			})
			.catch(err => {		
				return [];
		});
	  },
	  getBerita: (parent,{id}) => {
		var id = id;
		return Berita.findOne({where: { id: id }})
			.then(data => {
					return data;		
			})
			.catch(err => {
				return {};
			});
	},
},

	Mutation: {
		createBerita: (parent,{judul, deskripsi, isi, gambar}) => {
			var berita = {
				judul: judul,
				deskripsi: deskripsi,
				isi: isi,
				gambar: gambar
			}
			return Berita.create(berita)
					.then(data => {
						return data;
					})
					.catch(err => {
						return {};
					});
		},
		createKomen1s: (parent,{idberita, nama, isi}) => {
			var komen = {
				idberita: idberita,
				nama: nama,
				isi: isi
			}
			return Komen1s.create(komen)
					.then(komen => {
						return komen;
					})
					.catch(err => {
						return {};
					});
		},
		updateBerita: (parent,{id, judul, deskripsi, isi, gambar}) => {
			var berita = {
				judul: judul,
				deskripsi: deskripsi,
				isi: isi,
				gambar: gambar
			}
			return Berita.update(berita, {
				where: {id:id}
			})
					.then(num => {
						return {
							id: id,
							judul: judul,
							deskripsi: deskripsi,
							isi: isi,
							gambar: gambar
						}
					})
					.catch(err => {
						return {};
					});
		},
		deleteBerita: (parent,{id}) => {
			return Berita.findByPk(id)
				.then(baca => {
					if(baca){
						return Berita.destroy({
							where: {id: id}
						})
						.then(num => {
							return baca;
						})
						.catch(err => {
							return {};
						})
					}else{
						return {};
					}
				})
		}

	},
	
  };


  const {
	ApolloServerPluginLandingPageLocalDefault
  } = require('apollo-server-core');
  
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.

  const fs = require('fs');
  const path = require('path');
const { komen1s } = require('./models');
  const typeDefs = fs.readFileSync("./skema.graphql", "utf8").toString();

  const server = new ApolloServer({
	typeDefs,
	resolvers,
	csrfPrevention: true,
	cache: 'bounded',
	/**
	 * What's up with this embed: true option?
	 * These are our recommended settings for using AS;
	 * they aren't the defaults in AS3 for backwards-compatibility reasons but
	 * will be the defaults in AS4. For production environments, use
	 * ApolloServerPluginLandingPageProductionDefault instead.
	**/
	plugins: [
	  ApolloServerPluginLandingPageLocalDefault({ embed: true }),
	],
  });
  
  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
  });  