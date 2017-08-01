import React from 'react';
import CustomScroll from 'react-custom-scroll';
import { Link } from 'react-router';
import { listDashboard } from '../../../../actions/Lection';

export default class Library extends React.Component {

  constructor() {
    super();

    this.state = { lections: []};
  }

  componentWillMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    if (this.props.courseId != prevProps.courseId) {
      this.update();
    }
  }

  update() {
    listDashboard(
      {courseId: this.props.courseId},
      (r) => this.setState({lections: r}),
      (e) => console.error(e)
    );
  }

  render() {  
    return (
      <div>
        <div class="title border-color3 text-bold">
          Die Bibliothek:
        </div>

        <ul class="list">
          { this.state.lections.map((lection) => (
            <li key={lection.id}>
              <div class="title text-bold">
                { lection.title }
                <Link to={"/lection/" + lection.id} class="icon hexagon"></Link>
              </div>
            </li>
          ))}
        </ul>
          
        <Link to="/course" className="btn color3 border-color3" style={{ marginTop: '15px' }}>Mehr</Link>
      </div>
    );
  }
}
