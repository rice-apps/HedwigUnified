import {React, Component} from 'react';

const navigate = useNavigate()

class ErrorBoundary extends Component {
  
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log("Error in error boundary!");
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      nagivate('/report_bug')
    }

    return this.props.children; 
  }
}

export default ErrorBoundary