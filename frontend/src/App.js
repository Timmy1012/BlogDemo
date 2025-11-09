import './App.css';
import { Component } from "react";
import EditArticleModal from "./components/EditArticleModal";
import axios from "axios";


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articleList: [],
      modal: false,
      activeItem: {
        title: "",
        content: ""
      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios.get("/api/articles/")
      .then(res => this.setState({ articleList: res.data }))
      .catch(err => console.log(err));
  }

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  _getCSRFToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('csrftoken=')) {
          cookieValue = cookie.substring('csrftoken='.length);
          break;
        }
      }
    }
    return cookieValue;
  }

  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      axios
        .put(`/api/articles/${item.id}/`, item, {
          headers: {
            'X-CSRFToken': this._getCSRFToken(),
          },
        })
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/api/articles/", item, {
        headers: {
          'X-CSRFToken': this._getCSRFToken(),
        },
      })
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
      .delete(`/api/articles/${item.id}/`, {
        headers: {
          'X-CSRFToken': this._getCSRFToken(),
        },
      })
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };


  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Articles</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button className="btn btn-primary"
                  onClick={this.createItem}>
                  Add Article
                </button>
              </div>
              {this.state.articleList.map(article => (
                <div key={article.id} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{article.title}</h5>
                    <p className="card-text">{article.content}</p>
                    <button className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => this.editItem(article)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger"
                      onClick={() => this.handleDelete(article)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <EditArticleModal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}

export default App;
