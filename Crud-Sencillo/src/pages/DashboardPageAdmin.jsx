import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = 'http://ip172-18-0-19-clvo57ss9otg00988mhg-8080.direct.labs.play-with-docker.com/api/users';
const moviesApiUrl = 'http://ip172-18-0-19-clvo57ss9otg00988mhg-8080.direct.labs.play-with-docker.com/api/movies';


class DashboardPageAdmin extends Component {
  state = {
    data: [],
    movies: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: '',
      name: '',
      email: '',
      genero: '',
      pelicula: '',
      rating: 0,
      tipoModal: '',
    },
    search: '',
    filteredData: [],
  };

  peticionGet = () => {
    axios
      .get(url)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionGetMovies = () => {
    axios
      .get(moviesApiUrl)
      .then((response) => {
        this.setState({ movies: response.data }, () => {
          console.log('Datos de películas actualizados:', this.state.movies);
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionPost = async () => {
    delete this.state.form.id;
    await axios
      .post(url, this.state.form)
      .then((response) => {
        this.modalInsertar();
        this.peticionGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionPut = () => {
    axios
      .put(`${url}/${this.state.form.id}`, this.state.form)
      .then(() => {
        this.modalInsertar();
        this.peticionGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  peticionDelete = () => {
    axios
      .delete(`${url}/${this.state.form.id}`)
      .then(() => {
        this.setState({ modalEliminar: false });
        this.peticionGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarEmpresa = (empresa) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: empresa.id,
        name: empresa.name,
        email: empresa.email,
        genero: empresa.genero || '',     // Nuevo campo
        pelicula: empresa.pelicula || '',
        rating: empresa.rating || 0,
      },
    });
  };

  handleChange = async (e) => {
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value }, () => {
      this.filterData();
    });
  };

  filterData = () => {
    const { data, search } = this.state;

    const filteredData = data.filter((empresa) => {
      const name = empresa.name || '';
      const email = empresa.email || '';

      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase())
      );
    });

    this.setState({ filteredData });
  };

  componentDidMount() {
    this.peticionGet();
    this.peticionGetMovies();
  }
  renderMoviesList = () => {
    const { movies, editingMovieId } = this.state;

    return (
      <div>
        <h2>Listado de Películas</h2>
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Película</th>
              <th>Género</th>
              <th>Ratings</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>{movie.pelicula}</td>
                <td>{movie.genero}</td>
                <td>
                  {editingMovieId === movie.id ? (
                    <input
                      type="number"
                      className="form-control"
                      value={movie.ratings[0]}
                      onChange={(e) => this.handleRatingChange(e, movie.id)}
                    />
                  ) : (
                    movie.ratings[0]
                  )}
                </td>
                <td>
                  {editingMovieId === movie.id ? (
                    <button className="btn btn-success" onClick={() => this.saveRating(movie.id)}>
                      Guardar
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => this.startEditingRating(movie.id)}>
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  render() {
    const { form, filteredData } = this.state;
    return (
      <div className="App">
        <br />
        <br />
        <br />
        <button
          className="btn btn-success"
          onClick={() => {
            this.setState({ form: null, tipoModal: 'insertar' });
            this.modalInsertar();
          }}
        >
          Agregar Usuario
        </button>
        <br />
        <br />
        <input
          type="text"
          placeholder="Buscar por nombre o email"
          className="form-control"
          onChange={this.handleSearchChange}
          value={this.state.search}
        />
        <br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Género</th>
              <th>Película</th>
              <th>Rating</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((empresa) => (
              <tr key={empresa.id}>
                <td>{empresa.id}</td>
                <td>{empresa.name}</td>
                <td>{empresa.email}</td>
                <td>{empresa.genero}</td>
                <td>{empresa.pelicula}</td>
                <td>{empresa.rating}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      this.seleccionarEmpresa(empresa);
                      this.modalInsertar();
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  {'   '}
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      this.seleccionarEmpresa(empresa);
                      this.setState({ modalEliminar: true });
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="7">No se encontraron resultados.</td>
              </tr>
            )}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>
              x
            </span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input
                className="form-control"
                type="text"
                name="id"
                id="id"
                readOnly
                onChange={this.handleChange}
                value={form && form.id !== undefined ? form.id : this.state.data.length + 1}
              />
              <br />
              <label htmlFor="name">Nombre</label>
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                onChange={this.handleChange}
                value={form && form.name !== undefined ? form.name : ''}
              />
              <br />
              <label htmlFor="email">Email</label>
              <input
                className="form-control"
                type="text"
                name="email"
                id="email"
                onChange={this.handleChange}
                value={form && form.email !== undefined ? form.email : ''}
              />
              {/* Nuevos campos del formulario */}
              <br />
              <label htmlFor="genero">Género</label>
              <input
                className="form-control"
                type="text"
                name="genero"
                id="genero"
                onChange={this.handleChange}
                value={form && form.genero !== undefined ? form.genero : ''}
              />
              <br />
              <label htmlFor="pelicula">Película</label>
              <select
                className="form-control"
                name="pelicula"
                id="pelicula"
                onChange={this.handleChange}
                value={form && form.pelicula !== undefined ? form.pelicula : ''}
              >
                <option value="">Selecciona una película</option>
                {this.state.movies.map((movie) => (
                  <option key={movie.id} value={movie.title}>
                    {movie.title}
                  </option>
                ))}
              </select>
              <br />
              <label htmlFor="rating">Rating</label>
              <select
                className="form-control"
                name="rating"
                id="rating"
                onChange={this.handleChange}
                value={form && form.rating !== undefined ? form.rating : 0}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal === 'insertar' ? (
              <button className="btn btn-success" onClick={() => this.peticionPost()}>
                Insertar
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                Actualizar
              </button>
            )}
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>Estás seguro que deseas eliminar a la empresa {form && form.name}</ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>
              Sí
            </button>
            <button className="btn btn-secondary" onClick={() => this.setState({ modalEliminar: false })}>
              No
            </button>
          </ModalFooter>
        </Modal>
        {this.renderMoviesList()}
      </div>

    );
  }
}

export default DashboardPageAdmin;


