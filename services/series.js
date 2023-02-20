const request = require('request');
const cheerio = require('cheerio');
const { getAllSessions } = require("./sessions");
const { ApiEndpoints } = require("../common/apiEndpoints");
const { MoreActorsBtn, insertSerie, downloadImage, MoreActors } = require('./shared');

// get Series links
const getSerieslinks = (index) => {


    return new Promise((resolve, reject) => {

        const repeater = () => {
            request(`${ApiEndpoints.Series.SeriesPageLink}${index}`, async (err, res, body) => {

                if (err) reject(err)

                else if (res.statusCode === 200) {
                    console.log(`Get Series links => ${index}`);

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

                        reject({ message: "getSerieslinks", status: res.statusCode })
                    }

                }


            });

        }

        repeater()

    })
}

// get All Series links
const getAllSerieslinks = (limit) => {

    return new Promise(async (resolve, reject) => {

        let step = limit
        const Links = []

        const repeater = async () => {

            await getSerieslinks(step).then(res => {

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

// get Serie
const getSerie = (title, year, url) => {


    return new Promise((resolve, reject) => {


        const repeater = async () => {
            //encodeURI(url)
            request(url, async (err, res, body) => {
                if (err) reject(err)

                else if (res.statusCode === 200) {

                    console.log(`Get Serie : ${title} => Start`);

                    const $ = cheerio.load(body);


                    const json = {
                        Location: "", Language: "", Country: "", Wins: "", CategoryWatch: "",
                        Duration: "", Category: "", Quality: "", Types: [],
                        Title: "", Year: "",
                        AlsoKnown: "", Description: "", Trailer: "", Actors: [],
                        Poster: "", Rating: "", Tags: [], Link: ""
                    }


                    json.Link = url;
                    json.Title = title;
                    json.Year = year;
                    json.AlsoKnown = $('.HeadingSingleBox  .Aidn p').text().trim();
                    json.Description = $('.HeadingSingleBox  .StoryMovie div').text().trim();
                    json.Rating = $('.MinSingleSelcted .Ratese span').text().trim();
                    json.Trailer = $(".TrailerCode iframe").attr("data-ifr");

                    json.Tags = $('.ThatsTags ol li a span').map(function () {
                        return $(this).text().trim()
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

                    await downloadImage(Poster, json.Title, json.Year, "series").then(res => {
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


                    const Sessions = $('.BoxesInside .FullSeasson a').map(function () {
                        return {
                            title: $(this).attr("title"),
                            url: $(this).attr("href"),
                        }
                    }).get()

                    await insertSerie(json).then(async (id) => {

                        await getAllSessions(id, Sessions?.reverse()).then(_sessions => {
                            //json.Sessions = sessions
                            resolve("")

                        }).catch(err => {
                            reject({ message: err.message, status: err.status })
                        })

                    }).catch(err => {
                        reject({ message: err.message, status: err.status })
                    })



                } else {

                    if (res.statusCode == 503) {

                        repeater()

                    } else {

                        reject({ message: "getSerie", status: res.statusCode })
                    }

                }

            })
        }


        repeater()

    })
}

// get All Series
const getAllSeries = (limit) => {

    return new Promise(async (resolve, reject) => {

        const Links = []

        await getAllSerieslinks(limit).then(async res => {

            res.map(link => {
                Links.push(link)
            })


            let step = 40, title = Links[40].title, year = Links[40].year, url = Links[40].url
            //const Series = []

            const repeater = async () => {

                await getSerie(title, year, url).then(_serie => {
                    // Series.push(Serie)
                    console.log(`Get Serie : ${title} ${year} => Finished (${Links.length}/${(step + 1)})`);
                }).catch(err => {
                    reject(err)
                })

                if (step >= (Links.length - 1)) {
                    //resolve({ Series: Series })
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





 
module.exports = { getSerieslinks, getAllSerieslinks, getSerie, getAllSeries }