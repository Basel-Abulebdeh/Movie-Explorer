$(function () {

  let API_KEY = "e844b755";
  let API_URL = "https://www.omdbapi.com/";


  let $form = $(document.querySelector(".search-form"));
  let $input = $(document.querySelector(".search-input"));


  let $message = $(document.querySelector(".message"));
  let $spinner = $(document.querySelector(".spinner-box"));
  let $movies = $(document.querySelector(".movies"));

  function showMessage(text) {
    $message.removeClass("d-none");
    $message.text(text)
  }

  $form.on("submit", function (event) {
    event.preventDefault();

    let movieTitle = $input.val();

    if (movieTitle === " ") {
      showMessage("Please enter movie's title");
      return;
    }
    searchMovies(movieTitle);
  });

  function searchMovies(movieTitle) {
    $.ajax({
      url: API_URL,
      method: "GET",
      dataType: "json",
      data: { apikey: API_KEY, s: movieTitle, type: "movie" },

      beforeSend: function () {
        $message.addClass("d-none");
        $spinner.removeClass("d-none");
      },

      success: function (data) {
        if (data.Response === "True") {
          showMovies(data.Search);
        } else {
          showMessage("No movies matches your search");
        }
      },

      error: function () {
        showMessage("Please try again");
      },

      complete: function () {
        $spinner.addClass("d-none");
      }
    });
  }

  function showMovies(movieList) {
    $.each(movieList, function (index, movie) {
      let card = $(
        "<div class='col-12 col-md-6 col-lg-3 mb-4'>" +
          "<div class='card movie-card'>" +
            "<img class='card-img-top'>" +
            "<div class='card-body'>" +
              "<h5 class='card-title'></h5>" +
              "<p class='card-text'></p>" +
            "</div>" +
          "</div>" +
        "</div>"
      );

      if (movie.Poster === "N/A") {
        card.find("img").remove();
      } else {
        card.find("img").attr("src", movie.Poster);
      }

      card.find(".card-title").text(movie.Title);
      card.find(".card-text").text(movie.Year);
      card.find(".movie-card").data("id", movie.imdbID);

      $movies.append(card);
    });
  }

});