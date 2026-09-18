// Reading list behind the machine learning / deep learning side of the profile.
// `note` is a short, personal line — edit it freely so it sounds like you.
export const books = [
  {
    id: 1,
    title: "Machine Learning for Algorithmic Trading",
    edition: "2nd Edition",
    authors: ["Stefan Jansen"],
    publisher: "Packt",
    year: 2020,
    status: "Read",
    topics: ["Machine Learning", "Quantitative Finance", "Python", "Alternative Data"],
    note: `End-to-end workflow for turning market and alternative data into predictive
    signals: feature engineering on financial time series, walk-forward validation,
    and the backtesting discipline that keeps a model honest out of sample. The
    closest match to the quantitative risk work I do day to day.`,
  },
  {
    id: 2,
    title: "Machine Learning with PyTorch and Scikit-Learn",
    authors: ["Sebastian Raschka", "Yuxi (Hayden) Liu", "Vahid Mirjalili"],
    publisher: "Packt",
    year: 2022,
    status: "Read",
    topics: ["Deep Learning", "PyTorch", "scikit-learn", "Neural Networks"],
    note: `From classical estimators through to neural networks, transformers and
    training loops written by hand in PyTorch. This is the foundation I build the
    deep learning projects on — including the transformer fine-tuning work in the
    PII detection pipeline.`,
  },
];
