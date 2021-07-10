import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //0). Update Results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 1. loading recipe
    await model.loadRecipe(id);

    //2. rendering recipe
    recipeView.render(model.state.recipe);

    //TEST RENDER
    // controlServings();
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchresults = async function () {
  try {
    resultsView.renderSpinner();
    //1). Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    //2). Load Search Results
    await model.loadSearchResults(query);

    //3). Render Search Results
    resultsView.render(model.getSearchResultsPage());

    //4). Render Initial Pagination Buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  //1). Render NEW Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2). Render NEW Pagination Buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update recipe servings (in the data/model)
  model.updateServings(newServings);

  //update recipe view
  // recipeView.render(model.state.recipe); will update everything vs update only text/attributes in DOM w/o re-rendering
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //update recipeview
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  //upload new recipe data
  try {
    //spinner
    addRecipeView.renderSpinner();

    //upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmark view so updated
    //new elements use render not update!
    bookmarksView.render(model.state.bookmarks);

    //change id in url
    //1. state, 2. title (not relevant) 3.url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('Our Error: ', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchresults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
