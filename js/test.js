$(function () {

  let API_KEY = "e844b755";
  let API_URL = "https://www.omdbapi.com/";

  let $form = $(document.querySelector(".search-form"));
  let $input = $(document.querySelector(".search-input"));

  let $message = $(document.querySelector(".message"));
  let $spinner = $(document.querySelector(".spinner-box"));
  let $movies = $(document.querySelector(".movies"));
  let $newRelease = $(document.querySelector(".new-release"));

  let $modal = $(document.querySelector(".movie-modal"));
  let $modalTitle = $(document.querySelector(".modal-title"));
  let $modalPoster = $(document.querySelector(".modal-poster"));
  let $modalRating = $(document.querySelector(".modal-rating"));
  let $modalActors = $(document.querySelector(".modal-actors"));
  let $modalPlot = $(document.querySelector(".modal-plot"));

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
        $movies.empty();
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
    $newRelease.addClass("d-none");

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

  $movies.on("click", ".movie-card", function () {
    let id = $(this).data("id");
    showDetails(id);
  });

  function showDetails(id) {
    $modalTitle.text("Loading, please wait");
    $modalPoster.hide();
    $modalRating.text("");
    $modalActors.text("");
    $modalPlot.text("");
    $modal.modal("show");

    $.ajax({
      url: API_URL,
      method: "GET",
      dataType: "json",
      data: { apikey: API_KEY, i: id, plot: "full" },

      success: function (movie) {
        $modalTitle.text(movie.Title);
        $modalRating.text("IMDb rating: " + movie.imdbRating);
        $modalActors.text("Actors: " + movie.Actors);
        $modalPlot.text("Plot: " + movie.Plot);

        if (movie.Poster !== "N/A") {
          $modalPoster.attr("src", movie.Poster).show();
        }
      },

      error: function () {
        $modalTitle.text("Error");
        $modalPlot.text("Could not find the movie's details");
      }
    });
  }

});