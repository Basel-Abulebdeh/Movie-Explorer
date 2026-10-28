$(function () {

  let API_KEY = "Real_API_KEY";
  let API_URL = "https://www.omdbapi.com/";
  let searchedTitle = "";
  let randomWords = ["batman","maze","detective","love", "war", "night", "star", "dark", "man", "world", "life", "city", "dream", "day", "king", "home", "blood", "girl", "time", "last", "secret", "fire", "road", "black", "red", "heart", "game", "death", "summer", "ghost", "blue", "money", "island"];

  let $form = $(document.querySelector(".search-form"));
  let $input = $(document.querySelector(".search-input"));
  let $message = $(document.querySelector(".message"));
  let $spinner = $(document.querySelector(".spinner-box"));
  let $movies = $(document.querySelector(".movies"));
  let $pages = $(document.querySelector(".pages"));
  let $modal = $(document.querySelector(".movie-modal"));
  let $modalTitle = $(document.querySelector(".modal-title"));
  let $modalPoster = $(document.querySelector(".modal-poster"));
  let $modalRating = $(document.querySelector(".modal-rating"));
  let $modalActors = $(document.querySelector(".modal-actors"));
  let $modalPlot = $(document.querySelector(".modal-plot"));
  let $modalClose = $(document.querySelector(".modal-close"));

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
    searchedTitle = movieTitle;
    searchMovies(movieTitle, 1);
  });

  function searchMovies(movieTitle, page) {
    $.ajax({
      url: API_URL,
      method: "GET",
      dataType: "json",
      data: { apikey: API_KEY, s: movieTitle, type: "movie", page: page },

      beforeSend: function () {
        $movies.empty();
        $pages.empty();
        $message.addClass("d-none");
        $spinner.removeClass("d-none");
      },

      success: function (data) {
        if (data.Response === "True") {
          showMovies(data.Search);
          showPages(data.totalResults, page);
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

  function showRandomMovies() {
    let word = randomWords[Math.floor(Math.random() * randomWords.length)];
    let page = Math.floor(Math.random() * 5) + 1;

    $.ajax({
      url: API_URL,
      method: "GET",
      dataType: "json",
      data: { apikey: API_KEY, s: word, type: "movie", page: page },

      beforeSend: function () {
        $spinner.removeClass("d-none");
      },

      success: function (data) {
        if (data.Response === "True") {
          let shuffled = data.Search.sort(function () {
            return Math.random() - 0.5;
          });
          showMovies(shuffled);
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

  function addPage(text, page, isActive, isDisabled) {
    let item = $("<li class='page-item'><a class='page-link' href='#'></a></li>");
    item.find("a").text(text).data("page", page);

    if (isActive) {
      item.addClass("active");
    }

    if (isDisabled) {
      item.addClass("disabled");
    }

    $pages.append(item);
  }

  function showPages(totalResults, currentPage) {
    let totalPages = Math.min(Math.ceil(totalResults / 10), 100);

    if (totalPages <= 1) {
      return;
    }

    let firstPage = Math.min(currentPage, totalPages - 1);

    addPage("<<", currentPage - 1, false, currentPage === 1);
    addPage(firstPage, firstPage, firstPage === currentPage, false);
    addPage(firstPage + 1, firstPage + 1, firstPage + 1 === currentPage, false);
    addPage(">>", totalPages, false, currentPage === totalPages);
  }

  $pages.on("click", ".page-link", function (event) {
    event.preventDefault();
    searchMovies(searchedTitle, $(this).data("page"));
    window.scrollTo(0, 0);
  });

  $movies.on("click", ".movie-card", function () {
    let id = $(this).data("id");
    showDetails(id);
  });

  $modalClose.on("click", function () {
    $modal.modal("hide");
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

  showRandomMovies();
});