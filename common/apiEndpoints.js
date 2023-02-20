const Host = {
  ROOT: "http://localhost:3000",
  PREFIX: "/v1/api",
}
  
const ApiEndpoints = {  
  Movies: {
    route: `${Host.PREFIX}/movies`,
    getMovieslinks: `/getMovieslinks/:index`,
    getAllMovieslinks: `/getAllMovieslinks/:limit`,
    getMovie: `/getMovie/:title/:year/:url(*)`,
    getAllMovies: `/getAllMovies/:limit`,
    MoreActorsBtn: `/MoreActorsBtn/:postId/:cookie`,
    //
    MoviesPageLink: `https://w.cima4up.link/movies-hd17/page/`,
    //
    MoreActorsBtnLink: `https://w.cima4up.link/wp-admin/admin-ajax.php`,
    
  },

  Series: {
    route: `${Host.PREFIX}/series`,
    getSerieslinks: `/getSerieslinks/:index`,
    getAllSerieslinks: `/getAllSerieslinks/:limit`,
    getSerie: `/getSerie/:title/:year/:url(*)`,
    getAllSeries: `/getAllSeries/:limit`,
    // 
    SeriesPageLink: `https://w.cima4up.link/series-hd-1/page/`,

    
  },

  Sessions: {
    route: `${Host.PREFIX}/sessions`,
    getSession: `/getSession/:title/:url(*)`,
    getAllSessions: `/getAllSessions`,
    
  },

  Episodes: {
    route: `${Host.PREFIX}/episodes`,
    getEpisode: `/getEpisode/:title/:url(*)`,
    getAllEpisodes: `/getAllEpisodes`,
    
  },

 


};

module.exports = {ApiEndpoints , Host}