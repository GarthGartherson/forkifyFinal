import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
import View from './View.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _message = '';
  _errorMessage = 'No recipes found for your query. Please try another one!';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

{
  /* <div class="preview__user-generated">
<svg>
    <use href="${icons}#icon-user"></use>
</svg>
</div> */
}

export default new ResultsView();
