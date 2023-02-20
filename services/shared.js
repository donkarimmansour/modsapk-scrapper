const request = require('request');
const cheerio = require('cheerio');
const querystring = require('querystring');
const fs = require('fs');
const MoviesModal = require("../models/movies")
const SeriesModal = require("../models/series")
const EpisodesModal = require("../models/Episodes")
const SessionsModal = require("../models/sessions")
const fileModal = require("../models/file")
const { ApiEndpoints } = require("../common/apiEndpoints");


// insert Movie
const insertMovie = (data) => {

    return new Promise(async (resolve, reject) => {

        const { Location, Title, AlsoKnown, Description, Year, Language, Country, Wins, CategoryWatch, Duration, Rating,
            Category, Quality, Trailer, Poster, Group, Types, Actors, Watches, Downloades, Tags, Link } = data

        //insert
        MoviesModal.create({
            Location, Title, AlsoKnown, Description, Year, Language, Country, Wins, CategoryWatch, Duration, Rating,
            Category, Quality, Trailer, Poster, Group, Types, Actors, Watches, Downloades, Tags, Link
        }, (errCreate, doc) => {
            if (errCreate) {
                reject({ message: "insertMovie", status: 400 })
                return
            }

            resolve(doc._id)
        })

    })

}


// insert Serie
const insertSerie = (data) => {

    return new Promise(async (resolve, reject) => {

        const { Location, Title, AlsoKnown, Description, Year, Language, Country, Wins, CategoryWatch, Duration, Rating,
            Category, Quality, Trailer, Poster, Types, Actors, Tags, Link } = data

        //insert
        SeriesModal.create({
            Location, Title, AlsoKnown, Description, Year, Language, Country, Wins, CategoryWatch, Duration, Rating,
            Category, Quality, Trailer, Poster, Types, Actors, Tags, Link
        }, (errCreate, doc) => {
            if (errCreate) {
                reject({ message: "insertSerie", status: 400 })
                return
            }

            resolve(doc._id)
        })

    })

}


// insert Session
const insertSession = (id, data) => {

    return new Promise(async (resolve, reject) => {

        const { Location, Title, Year, Language, Country, Wins, CategoryWatch, Duration, Rating, Category, Quality, Poster, Types, Tags, Link } = data

        //insert
        SessionsModal.create({
            Location, Title, Year, Language, Country, Wins, CategoryWatch, Duration, Rating,
            Category, Quality, Poster, Types, Tags, Serie: id, Link
        }, (errCreate, doc) => {
            if (errCreate) {
                console.log("Session Err => " , errCreate);
                reject({ message: "insertSession", status: 400 })
                return
            }

            resolve(doc._id)
        })

    })

}



// insert Episode
const insertEpisode = (id, data) => {

    return new Promise(async (resolve, reject) => {

        const Episodes = data.map(episode => {
            const { Location, Title, Language, Country, Wins, CategoryWatch, Duration, Category, Quality, Types, Tags, Watches, Downloades, Link } = episode
            return { Location, Title, Language, Country, Wins, CategoryWatch, Duration, Category, Quality, Types, Tags, Watches, Downloades, Link, Session: id }
        })


        //insert 
        EpisodesModal.insertMany(Episodes, (errCreate, doc) => {
            if (errCreate) {
                reject({ message: "insertEpisode", status: 400 })
                return
            }

            resolve(doc)
        })

    })

}

// insert File
const insertFile = (fileName) => {

    return new Promise(async (resolve, reject) => {

        //insert
        fileModal.create({
            image: fileName
        }, (errCreate, doc) => {
            if (errCreate) {
                reject({ message: "insertFile", status: 400 })
                return
            }

            resolve(doc._id)
        })

    })

}


// More Actors
const MoreActors = (data) => {

    return new Promise((resolve, reject) => {

        let step = 0
        const actors = []

        const repeater = async (actor) => {
            if (step >= data.length) {
                resolve(actors)
            } else {
            
                await downloadImage(actor.img, actor.name, "2022", "actors").then(id => {
                    console.log(`Get Actor => ${actor.name} : (${data.length}/${step + 1})`);

                    actors.push({ img: id, name: actor.name, role: actor.role })
                }).catch(err => {
                    reject({ message: err.message, status: err.status })
                })

                step++
                await repeater(data[step])
            }
        }
        repeater(data[step])
    })
}

// More Actors Btn
const MoreActorsBtn = (postId, cookie) => {

    return new Promise((resolve, reject) => {

        let counter = 0

        const actors = []

        const repeater = async () => {

            request({
                url: `${ApiEndpoints.Movies.MoreActorsBtnLink}`,
                headers: {
                    "Cookie": cookie,
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest",
                    "Sec-Fetch-Mode": "cors"
                },
                method: "POST",
                body: querystring.stringify({ action: "MoreTeamworkList", loaded: counter, post: postId }),
            }, async (err, res, bodyc) => {

                if (err) reject(err);
                else if (res.statusCode === 200) {
                    const data = JSON.parse(bodyc)

                    if (data && data.length > 0) {

                        const Actors = data.map((a) => {
                            return {
                                img: cheerio.load(a.photo)("img").attr('data-img'),
                                name: a.name, role: a.vname, id: a.id
                            }
                        })

                        await MoreActors(Actors, postId).then(actor => {
                            actors.push(...actor)
                        }).catch(err => {
                            reject({ message: err.message, status: err.status })
                        })

                        counter += 10
                        await repeater()

                    } else {
                        console.log(`Get Actors => (${actors.length})`);
                        resolve(actors)
                    }

                } else {

                    if (res.statusCode == 503) {

                        await repeater()

                    } else {

                        reject({ message: "MoreActorsBtn", status: res.statusCode })

                    }


                }
            });
        }

        repeater()
    })
}


const downloadImage = (url, title, year, prefex) => {

    return new Promise(async (resolve, reject) => {

        const fileName = `${title.replace(/[ /\\]/g, "-")}_${year}.jpg`
        const dest = `./public/images/${prefex}`
        const path = `${dest}/${fileName}`
        let counter = 0

        const repeater = () => {

            console.log(`Download Image => (${counter}) : ${title} =>(${fileName})`);

            if (counter >= 50) {
                reject({ message: "downloadImage", status: 400 })
            } else {

                //file exists
                if (fs.existsSync(path)) {
                    fs.unlink(path, err => {
                        if (err) reject({ message: "downloadImage => unlink", status: 400 })
                    });
                }


                const file = fs.createWriteStream(path);
                const sendReq = request.get(url);

                sendReq.on('response', async (res) => {
                    if (res.statusCode === 200) {
                        console.log(`Download Image => ${prefex}/ ${title} (${year})`);

                        // resolve(res.statusCode)
                        await insertFile(fileName).then(id => {
                            console.log(`Insert Image => ${prefex}/ ${title} (${year})`);
                            resolve(id)
                        }).catch(err => {
                            reject({ message: err.message, status: err.status })
                        })

                    } else if (res.statusCode === 503) {
                        repeater()
                    }
                    counter++
                });

                sendReq.pipe(file);

                file.on('finish', () => {
                    file.close()
                });

                sendReq.on('error', (err) => {
                    fs.unlink(path, () => {
                        counter++
                        console.log(`Req : Image ${prefex} => Title : ${title} (${year})`);
                        // // repeater()
                        resolve(null)
                    }); 
                });

                file.on('error', (err) => {
                    fs.unlink(path, () => {
                        //counter++
                        console.log(`File : Image ${prefex} => Title : ${title} (${year})`);
                        //  repeater()
                        resolve(null)
                    });
                });

            }


        }

        repeater()

    })
};


module.exports = { MoreActors, insertMovie, insertSerie, insertSession, insertEpisode, MoreActorsBtn, downloadImage }