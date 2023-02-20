const request = require('request');
const cheerio = require('cheerio');
const { ApiEndpoints } = require("../common/apiEndpoints");
const { MoreActorsBtn, insertMovie, downloadImage, MoreActors } = require('./shared');

// get Movies links
const getMovieslinks = (index) => {


    return new Promise((resolve, reject) => {

        const repeater = () => {
            request(`${ApiEndpoints.Movies.MoviesPageLink}${index}`, async (err, res, body) => {

                if (err) reject(err)

                else if (res.statusCode === 200) {
                    console.log(`Get Movies links => ${index}`);

                    const $ = cheerio.load(body)

                    const data = $('.BoxItem').map(function () {
                        return {
                            url: $(this).find(".ButtonsArea > a").attr('href'),
                            year: $(this).find(".ContentHover h2 strong").text().trim().replace(/[()]/g, ""),
                            title: $(this).find(".ContentHover h2").children().remove().end().text()
                        }
                    }).get()

                    resolve(data)

                } else {



                    if (res.statusCode == 503) {

                        repeater()
                    } else {

                        reject({ message: "getMovieslinks", status: res.statusCode })
                    }

                }


            });

        }

        repeater()

    })
}

// get All Movies links
const getAllMovieslinks = (limit) => {

    return new Promise(async (resolve, reject) => {

        let step = limit
        const Links = []

        const repeater = async () => {

            await getMovieslinks(step).then(res => {

                res.map(link => {
                    Links.push(link)
                })

            }).catch(err => {
                reject({ message: err.message, status: err.status })
            })

            step--

            if (step <= 0) {
                resolve(Links)
            } else {
                await repeater()
            }



        }

        await repeater()

    })
}

// get Movie
const getMovie = (title, year, url) => {


    return new Promise((resolve, reject) => {


        const repeater = async () => {
            //url
            request(encodeURI(url), async (err, res, body) => {
                if (err) reject(err)

                else if (res.statusCode === 200) {

                    console.log(`Get Movie : ${title} => Start`);

                    const $ = cheerio.load(body);

                    const json = {
                        Location: "", Title: "", AlsoKnown: "", Description: "", Year: "",
                        Language: "", Country: "", Wins: "", CategoryWatch: "", Duration: "",
                        Rating: "", Category: "", Quality: "", Trailer: "", Poster: "",
                        Group: "", Types: [], Actors: [], Watches: [], Downloades: [], Tags: [], Link: ""
                    }

                    json.Link = url;
                    json.Group = $('.MinSingleSelcted h1 > a').text().trim();
                    json.Title = title;
                    json.Year = year;
                    json.AlsoKnown = $('.HeadingSingleBox  .Aidn p').text().trim();
                    json.Description = $('.HeadingSingleBox  .StoryMovie div').text().trim();
                    json.Rating = $('.MinSingleSelcted .Ratese span').text().trim();
                    json.Trailer = $(".TrailerCode iframe").attr("data-ifr");


                    json.Watches = $('.WatchServersList ul li a').map(function () {
                        return { name: $(this).text().trim(), url: $(this).attr('data-url') }
                    }).get()

                    json.Tags = $('.ThatsTags ol li a span').map(function () {
                        return $(this).text().trim()
                    }).get()

                    json.Downloades = $('.DownloadArea ul li a').map(function () {
                        return {
                            name: $(this).find("span").text().trim(),
                            quality: $(this).find("div span").eq(1).text().trim(),
                            size: $(this).find("div span").eq(0).text().trim(),
                            url: $(this).attr('href')
                        }
                    }).get()





                    $('ul.SingleTerms li').each(function () {
                        const type = $(this).find('i + span').text().trim()

                        if (type === "التصنيف") {
                            json.Category = $(this).find('p').text().trim()
                        } else if (type === "المدة") {
                            json.Duration = $(this).find('p').text().trim()
                        } else if (type === "النوع") {
                            $(this).find('p a').each(function () { json.Types.push($(this).text().trim()) })
                        } else if (type === "الجودة") {
                            json.Quality = $(this).find('p').text().trim()
                        } else if (type === "البلد و اللغة") {
                            json.Country = $(this).find('p a').eq(0).text().trim()
                            json.Language = $(this).find('p a').eq(1).text().trim()
                        } else if (type === "تصنيف المشاهدة") {
                            json.CategoryWatch = $(this).find('p a').text().trim()
                        } else if (type === "الجوائز") {
                            json.Wins = $(this).find('p a').text().trim()
                        } else if (type === "مواقع التصوير") {
                            json.Location = $(this).find('p span').text().trim()
                        }


                    })

                    const Poster = $('.ImgClass img').attr("data-img");

                    await downloadImage(Poster, json.Title, json.Year, "movies").then(res => {
                        json.Poster = res
                    }).catch(err => {
                        reject({ message: err.message, status: err.status })
                    })

                    const postId = $("a.MoreTeamworkList").attr("data-id")
                    const cookie = res.headers["set-cookie"]?.join("").substr(0, res.headers["set-cookie"].join("").lastIndexOf(";"))


                    await MoreActorsBtn(postId, cookie).then(actors => {
                        json.Actors = actors

                    }).catch(err => {
                        reject({ message: err.message, status: err.status })
                    })

                    if (json.Actors.length === 0) {
                        const Actors = $('#Teamwork .TeamworkList li a').map(function () {
                            return {
                                img: $(this).find("img").attr('data-img'),
                                name: $(this).find(".ActorName span").text().trim(),
                                role: $(this).find(".ActorName > em").children().remove().end().text().trim().replace(/[()]/g, "")
                            }

                        }).get()

                        await MoreActors(Actors).then(actors => {
                            json.Actors = actors
                        }).catch(err => {
                            reject({ message: err.message, status: err.status })
                        })
                    }

                    await insertMovie(json).then(_res => {
                        resolve("")
                    }).catch(err => {
                        reject({ message: err.message, status: err.status })
                    })


                } else {

                    if (res.statusCode == 503) {

                        repeater()

                    } else {

                        reject({ message: "getMovie", status: res.statusCode })
                    }

                }

            })
        }


        repeater()

    })
}

// get All Movies
const getAllMovies = (limit) => {

    return new Promise(async (resolve, reject) => {

        const Links = []

        await getAllMovieslinks(limit).then(async res => {

            res.map(link => {
                Links.push(link)
            })


            let step = 0, title = Links[0].title, year = Links[0].year, url = Links[0].url
            //const Movies = []

            const repeater = async () => {

                await getMovie(title, year, url).then(movie => {
                    // Movies.push(movie)
                    console.log(`Get Movie : ${title} ${year} => Finished (${Links.length}/${(step + 1)})`);
                }).catch(err => {
                    reject(err)
                })



                if (step >= (Links.length - 1)) {
                    resolve("done")
                } else {
                    step++
                    title = Links[step].title, year = Links[step].year, url = Links[step].url

                    await repeater()
                }

            }

            await repeater()

        }).catch(err => {
            reject(err)
        })
    })
}


module.exports = { getMovieslinks, getAllMovieslinks, getMovie, getAllMovies }