# Serenity Sphere - AI-Powered Mental Health Platform

<div align="center">
  <img src="frontend/public/logo.png" alt="Serenity Sphere Logo" width="200"/>
  
  [![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
  [![React](https://img.shields.io/badge/react-18.0.0-blue.svg)](https://reactjs.org/)
  [![Django](https://img.shields.io/badge/django-4.2.0-green.svg)](https://www.djangoproject.com/)
  [![PostgreSQL](https://img.shields.io/badge/postgresql-14.0-blue.svg)](https://www.postgresql.org/)
  [![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.3.0-38B2AC.svg)](https://tailwindcss.com/)
  [![Redux](https://img.shields.io/badge/redux-4.2.0-764ABC.svg)](https://redux.js.org/)
  [![RoBERTa](https://img.shields.io/badge/roberta-base-1.2GB-red.svg)](https://huggingface.co/roberta-base)

  A comprehensive mental health platform leveraging AI to provide personalized support and therapeutic exercises.
</div>

## 🌟 Features

### Core Functionality
- **Mood Tracking & Analysis**
  - Real-time mood monitoring
  - Emotional pattern recognition
  - AI-powered mood insights
  - Visual mood history

- **Personalized Exercise Recommendations**
  - Context-aware exercise suggestions
  - Dynamic difficulty adjustment
  - Progress-based recommendations
  - Category-specific exercises

- **Interactive Therapeutic Exercises**
  - Guided meditation sessions
  - Breathing exercises
  - Journaling prompts
  - Visualization exercises
  - Cognitive behavioral therapy (CBT) exercises

- **Journaling System**
  - Secure digital journaling
  - AI-powered writing prompts
  - Emotion analysis
  - Progress tracking

- **Emotional Support System**
  - Real-time emotional support
  - Crisis intervention resources
  - Community support features
  - Professional resource connections

### Technical Features
- **AI Integration**
  - Fine-tuned RoBERTa model for emotion analysis
  - Natural language processing for journal entries
  - Personalized content recommendations
  - Sentiment analysis

- **Security & Privacy**
  - End-to-end encryption
  - HIPAA-compliant data handling
  - Secure authentication
  - Data privacy controls

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 4.2
- **Database**: PostgreSQL 14
- **AI/ML**: 
  - RoBERTa model (fine-tuned)
  - TensorFlow/PyTorch
- **API**: Django REST Framework
- **Authentication**: JWT

### Frontend
- **Framework**: React 18
- **State Management**: Redux
- **Styling**: TailwindCSS
- **UI Components**: 
  - Framer Motion (animations)
  - React Icons
  - Custom components

### DevOps
- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Cloud Platform**: AWS/GCP

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 14
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/serenity-sphere.git
cd serenity-sphere
```

2. Set up the backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

3. Set up the frontend
```bash
cd frontend
npm install
npm run dev
```

4. Set up environment variables
```bash
# backend/.env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/serenity_sphere
AI_MODEL_PATH=path/to/your/model

# frontend/.env
REACT_APP_API_URL=http://localhost:8000/api
```

## 📚 Documentation

Detailed documentation is available in the [docs](docs/) directory:
- [API Documentation](docs/api.md)
- [AI Model Documentation](docs/ai-model.md)
- [Frontend Architecture](docs/frontend.md)
- [Backend Architecture](docs/backend.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- RoBERTa model by Facebook AI Research
- Django REST Framework team
- React and Redux communities
- All contributors and supporters

## 📞 Support

For support, email support@serenitysphere.com or join our [Discord community](https://discord.gg/serenitysphere).

---

<div align="center">
  Made with ❤️ for better mental health
</div>
