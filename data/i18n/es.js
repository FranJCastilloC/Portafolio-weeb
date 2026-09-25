/* Spanish overlay. English data in data/*.js is the source of truth for
   structure — images, links, dates, metrics. This file only replaces text
   fields, keyed by each item's id. Role titles and education follow the
   Spanish CV ("Francisco Castillo - CV Data Analyst (ES)"). */
export const es = {
  bioData: {
    descOne: `Profesional de datos que trabaja en la intersección entre machine learning y
    riesgo cuantitativo. Actualmente soy Analista de Riesgos en Parallax Valores (Parval),
    donde construyo los modelos y pipelines de datos sobre los que se apoyan las decisiones
    de inversión, y dedico el resto de mi tiempo a profundizar en machine learning y deep
    learning, que es hacia donde estoy llevando mi carrera.`,

    descTwo: `En modelado trabajo con Python en todo el ciclo: ingeniería de variables,
    entrenamiento y fine-tuning, y la evaluación que decide si un modelo realmente se puede
    usar: el balance entre precisión y recall, la calibración y el análisis de errores por
    segmento en lugar de una sola métrica global. Entre mis trabajos recientes está el
    fine-tuning de transformers multilingües para clasificación de tokens (NER) con PyTorch y
    Hugging Face, comparándolos con honestidad contra líneas base basadas en reglas.`,

    descThree: `En riesgo diseño y valido modelos cuantitativos (VaR histórico, Monte Carlo y
    de covarianzas, pruebas de estrés, análisis de sensibilidad, simulación de escenarios y
    backtesting) y automatizo los reportes que los acompañan con Python, SQL y Power BI. Más
    de cuatro años entre análisis de riesgos, control de calidad y control documental en
    entornos regulados, en servicios financieros y en manufactura de dispositivos médicos,
    me enseñaron lo que la mayoría del trabajo de ML subestima: un modelo solo es tan
    confiable como la validación de datos que tiene debajo.`,

    descFour: `Actualmente curso un Máster en Desarrollo de Inteligencia Artificial en la
    Universidad Alfonso X el Sabio (UAX). Mi objetivo es seguir avanzando hacia roles
    aplicados de machine learning y deep learning, aportando algo que a muchos profesionales
    de ML les falta: conocimiento real del dominio del riesgo financiero y un respeto, ganado
    a pulso, por la calidad de los datos.`,
  },

  experiences: {
    1: {
      session: "Jun 2024 - Presente",
      role: "Analista de Riesgos (Data Science)",
      summary:
        "Aplico ciencia de datos, estadística y principios de Inteligencia Artificial para evaluar riesgos financieros, validar grandes volúmenes de datos y optimizar estrategias de inversión mediante herramientas cuantitativas y automatización.",
    },
    2: {
      session: "Ago 2022 - Jun 2024",
      summary:
        "Gestioné y controlé la calidad de los datos maestros de materiales, BOMs y recetas en un entorno regulado de manufactura de dispositivos médicos.",
    },
    3: {
      session: "Ago 2022 - Jun 2023",
      summary:
        "Coordiné y revisé los cambios en documentos y procedimientos de manufactura dentro del sistema de gestión de calidad de la planta.",
    },
    4: {
      session: "Ene 2022 - Sep 2022",
      role: "Monitor de Control de Calidad",
      summary:
        "Realicé estudios de capacidad de procesos y enseñé gráficos de control, análisis de variables y metodología Seis Sigma.",
    },
    5: {
      session: "Jun 2021 - Oct 2022",
      summary:
        "Análisis estadístico de materias primas, auditorías de almacén y calibraciones de laboratorio; participé en un proyecto de auditoría YUM desarrollando la trazabilidad del producto.",
    },
  },

  education: {
    1: {
      session: "En curso",
      cardTitle: "Máster en Desarrollo de Inteligencia Artificial",
      cardSubtitleSecondary: "Máster",
    },
    2: { session: "En curso", cardSubtitleSecondary: "Certificación" },
    3: { cardSubtitleSecondary: "Certificación" },
    4: { session: "Dic 2023", cardSubtitleSecondary: "Certificación" },
    5: { cardTitle: "Introducción a las Bases de Datos", cardSubtitleSecondary: "Curso" },
    6: {
      session: "Abr 2023",
      cardTitle: "Grado en Ingeniería Industrial",
      cardSubtitleSecondary: "Grado",
    },
    7: {
      session: "Ene 2023",
      cardTitle: "Grado Menor en Manufactura de Dispositivos Médicos",
      cardSubtitleSecondary: "Grado menor",
    },
  },

  portfolioData: {
    1: {
      title: "Análisis de la tasa de abandono de clientes",
      subtitle: "Análisis de churn · Power BI",
      project: "Analista BI",
      desc: [
        `En el competitivo mercado de las telecomunicaciones, entender y gestionar la tasa de
        abandono de clientes es clave para el éxito del negocio. En ese contexto, este proyecto
        realiza un Análisis Exploratorio de Datos (EDA) exhaustivo en Power BI para estudiar la
        tasa de abandono de una empresa que ofrece servicios de internet y telefonía móvil.`,
        `El proyecto consta de nueve diapositivas que siguen un proceso de EDA, de lo más
        general a lo más específico, con el objetivo de entender por qué se van los clientes y
        proponer soluciones de negocio que reduzcan la tasa de abandono de la empresa.`,
      ],
    },
    2: {
      title: "Mapa interactivo del gasto municipal en RD",
      subtitle: "Mapa interactivo · Python/Folium",
      project: "Análisis exploratorio de datos",
      desc: [
        `Como parte de mi primer proyecto de exploración de datos, creé con Python y la librería
        Folium un mapa interactivo que geolocaliza cada uno de los ayuntamientos de la República
        Dominicana y ofrece información relevante sobre el gasto de los gobiernos locales en
        2022. El mapa no solo facilita ver la ubicación de los 393 municipios, sino que también
        presenta un análisis de los aspectos estadísticos más relevantes de cada uno.`,
        `Nota: para una mejor experiencia, desmarca la sección "Marked" para ver el mapa con más
        claridad y ocultar los puntos exactos.`,
      ],
    },
    3: {
      title: "Evaluación de un proceso de manufactura con SQL",
      subtitle: "Control estadístico de procesos · SQL",
      project: "SPC y SQL",
      desc: [
        `Forma parte de un conjunto de consultas complejas en SQL. La mayoría de los proyectos
        de SQL que encontrarás aquí son consultas pensadas para seleccionar y preparar datos que
        luego se analizan con otras herramientas, ya que SQL es una herramienta de consulta y
        administración de bases de datos.`,
        `En manufactura y control de calidad, el Control Estadístico de Procesos (SPC) cumple un
        papel crucial para identificar y corregir las variaciones de los procesos productivos que
        pueden afectar la calidad del producto final. Implementar SPC con SQL permite analizar
        grandes volúmenes de datos de producción con precisión y eficiencia: con consultas
        complejas se pueden monitorear de forma continua los parámetros críticos del proceso,
        detectar a tiempo las desviaciones fuera de los límites de control e identificar
        patrones que anticipan posibles problemas de calidad.`,
        `En este proyecto apoyo a un equipo que quiere mejorar la forma en que monitorea y
        controla un proceso de manufactura. El objetivo es implementar un enfoque más metódico,
        el control estadístico de procesos (SPC): una estrategia consolidada que usa datos para
        determinar si el proceso funciona bien. Los procesos solo se ajustan si las mediciones
        caen fuera de un rango aceptable.`,
      ],
    },
    4: {
      title: "Análisis de empresas unicornio con SQL",
      subtitle: "Análisis · SQL",
      project: "Analista de datos SQL",
      desc: [
        `Forma parte de un conjunto de consultas complejas en SQL. La mayoría de los proyectos
        de SQL que encontrarás aquí son consultas pensadas para seleccionar y preparar datos que
        luego se analizan con otras herramientas, ya que SQL es una herramienta de consulta y
        administración de bases de datos.`,
        `El encargo es apoyar a una firma de inversión analizando tendencias en empresas de alto
        crecimiento. Les interesa entender qué industrias generan las valoraciones más altas y a
        qué ritmo surgen nuevas empresas de alto valor. Esta información les da una ventaja
        competitiva sobre las tendencias de cada industria y sobre cómo estructurar su
        portafolio a futuro.`,
      ],
    },
    5: {
      title: "El mercado de apps Android en Google Play",
      subtitle: "EDA · Python",
      project: "Análisis del mercado de apps Android",
      desc: [
        `El proyecto hace un análisis integral del mercado de aplicaciones Android: explora más
        de diez mil aplicaciones de Google Play Store en distintas categorías. El objetivo es
        encontrar en los datos hallazgos que ayuden a diseñar estrategias para impulsar el
        crecimiento y la retención de usuarios.`,
        `Las apps móviles están en todas partes: son fáciles de crear y pueden ser rentables, y
        por eso cada vez se desarrollan más. El análisis compara más de diez mil aplicaciones de
        Google Play en distintas categorías en busca de hallazgos para diseñar estrategias de
        crecimiento y retención. Los datos se obtuvieron mediante scraping del sitio de Google
        Play. Aunque existen muchos datasets populares de la App Store de Apple, hay pocos de
        Google Play, en parte porque hacer scraping de esta última es más difícil.`,
      ],
    },
    6: {
      title: "Pruebas de hipótesis en salud: seguridad de medicamentos",
      subtitle: "EDA · Python · Estadística",
      project: "Pruebas de hipótesis en salud con Python",
      desc: [
        `El objetivo principal es explorar y responder preguntas sobre reacciones adversas a
        medicamentos, usando un conjunto de datos que incluye efectos adversos, datos
        demográficos y signos vitales, entre otros. Se busca determinar si las reacciones
        adversas, en caso de existir, tienen proporciones significativas, con distintas
        herramientas de programación en Python y estadística.`,
      ],
    },
    7: {
      subtitle: "Análisis · Tableau · Estadística",
      project: "EDA y pruebas de hipótesis",
      desc: ["En progreso"],
    },
    8: {
      title: "Motor de calidad de datos y detección de anomalías",
      subtitle: "Detección de anomalías · Python/PyTorch",
      project: "Ingeniería de Machine Learning",
      desc: [
        `Un motor de auditoría para grandes datasets tabulares financieros y de ERP. Puntúa la
        calidad de datos de un lote en cinco dimensiones, detecta anomalías a nivel de registro
        con un autoencoder profundo y devuelve un registro priorizado de incidencias, en el que
        cada hallazgo incluye el motivo por el que se levantó, una severidad calculada y una
        acción recomendada. Los modelos se entrenan con datos públicos de transacciones con
        tarjeta de crédito del dataset de detección de fraude de la ULB, junto con un extracto
        sintético de un ERP estilo SAP con proveedores, materiales, listas de materiales y
        órdenes de compra.`,
        `El autoencoder alcanza 3,2 veces el PR-AUC de una línea base de Isolation Forest con el
        mismo presupuesto de revisión: detecta 54 de 75 fraudes frente a 35 con el mismo esfuerzo
        del revisor. Como los datos sintéticos del ERP se corrompen llevando un registro exacto
        de cada defecto, el propio motor de calidad es medible: recupera el 99,5% de 4.665
        defectos inyectados, con 100% de precisión en las reglas deterministas. La demo en
        Streamlit acepta cualquier CSV y devuelve la auditoría completa.`,
      ],
    },
    9: {
      title: "Pipeline de detección y redacción de PII",
      desc: [
        `Sistema end-to-end que recibe documentos de negocio en español e inglés (facturas,
        contratos, correos, tickets de soporte y formularios de alta), detecta los datos
        personales que contienen, los redacta, asigna a cada detección una confianza calibrada
        y envía los casos ambiguos a una cola de revisión humana.`,
        `Se comparan tres detectores entre sí: un motor de reglas con validación real de dígitos
        de control (Luhn, IBAN mod-97, DNI/NIE, CUIT), Microsoft Presidio con spaCy multilingüe,
        y un modelo DistilBERT multilingüe ajustado para clasificación de tokens sobre 10 clases
        de PII, que alcanza un F1 de 0,935 en validación.`,
        `El hallazgo que definió la arquitectura: ningún enfoque gana solo. Las reglas dominan en
        los identificadores verificables por dígito de control, el modelo domina en texto libre,
        y solo el ensamble se mantiene cerca del mejor resultado en casi todos los tipos de
        entidad, reduciendo la fuga de PII un 40% frente a la línea base en documentos completos
        que nunca vio en entrenamiento.`,
        `La evaluación va más allá del F1, hacia las dos métricas que realmente pide un equipo de
        privacidad: la tasa de fuga (cuánta PII real sobrevivió) y la tasa de sobre-redacción
        (cuánto texto legítimo se destruyó). La confianza se calibra por detector y por tipo, lo
        que reduce el error de calibración esperado en un 75% donde un único ajuste global no
        mejora nada. Incluye una demo en Streamlit, 45 tests y un pipeline completo y
        reproducible.`,
      ],
    },
    10: {
      title: "Clasificación y extracción de documentos escaneados",
      desc: [
        `Entra un documento escaneado y el sistema responde tres preguntas: qué tipo de documento
        es, qué campos estructurados contiene y si esa extracción es confiable o necesita una
        persona. La tercera es la que convierte un demo de machine learning en un flujo de
        trabajo: replica el proceso de control documental y datos maestros que llevé en Jabil
        Healthcare, donde el costo real no es equivocarse, sino no saber que uno se equivocó.`,
        `Tesseract OCR alimenta un router de tipo de documento y un extractor de campos
        LayoutLMv3 ajustado, comparado contra una línea base de reglas y regex. Un motor de
        calidad de once reglas marca campos faltantes, errores de formato, aritmética que no
        cierra, baja confianza del OCR y órdenes de compra que no existen en los datos maestros,
        y envía esos documentos a una cola de revisión con el motivo adjunto. El umbral de
        revisión se calibra sobre un conjunto de validación contra una tolerancia de escape
        declarada, nunca sobre el conjunto de test.`,
        `El hallazgo principal contradice la hipótesis con la que empezó el proyecto. Sobre
        documentos escaneados reales, LayoutLMv3 supera a la línea base en clasificación por 7,6
        puntos (85,3% frente a 77,7%, McNemar p<0,001). En extracción de campos gana en los
        layouts que vio en entrenamiento (0,920 frente a 0,861 de exact match) y pierde en un
        layout nuevo (0,508 frente a 0,580). Un token-F1 de 96,5 en plantillas vistas contra
        68-72 en plantillas nuevas identifica la causa: con solo tres familias de plantilla, el
        modelo memoriza el layout en vez de aprender la relación entre etiqueta y valor. La
        solución es diversidad de datos, no un modelo más grande.`,
        `Está construido para resistir métricas infladas: las familias de plantilla y los pools
        de entidades son disjuntos entre splits y lo verifican tests, la extracción se reporta
        en tres niveles lado a lado (token-F1, exact match end-to-end y el techo del OCR que
        acota a ambos), y una sonda de cambio de dominio mide qué hace el router con facturas
        escaneadas reales: clasifica bien el 0%, que es exactamente cuánto de su accuracy en
        dominio venía del render limpio. Un entity-F1 de 89,84 en FUNSD frente a 90,29
        publicado ancla todo el stack a un benchmark externo.`,
      ],
    },
  },

  blogData: {
    1: {
      date: "Abril 2023",
      category: "Título universitario",
      title: "Instituto Tecnológico de Santo Domingo",
      desc: [
        `Profesional orientado al diseño, mejora, instalación e implementación de sistemas
        integrados por personas, equipos, materiales, información y energía. La carrera se basa
        en conocimientos especializados de ciencias matemáticas, físicas y químicas, junto con
        métodos de análisis estadístico, diseño, modelado y simulación, y principios de gestión
        e innovación.`,
      ],
    },
    2: {
      date: "Diciembre 2023",
      category: "Certificado",
      desc: [
        `La certificación Professional Data Analyst de DataCamp acredita a quienes aprueban dos
        exámenes y un caso práctico. Los exámenes evalúan competencias en gestión de datos,
        análisis exploratorio y experimentación estadística con SQL, R o Python. Quien la
        obtiene domina la extracción, unión y agregación de datos, así como su limpieza y
        preparación para el análisis, y sabe evaluar la calidad de los datos, realizar tareas de
        validación y calcular métricas sobre sus características y las relaciones entre ellas.`,
      ],
    },
    3: {
      date: "Febrero 2024",
      category: "Certificado",
      desc: [
        `La certificación SQL Associate de DataCamp acredita habilidades prácticas de SQL listas
        para uso profesional. Está pensada para quienes trabajan, o quieren trabajar, en roles
        que requieren SQL, y ofrece una validación esencial de esas habilidades en un mundo
        guiado por datos.`,
      ],
    },
    4: {
      date: "Junio 2022",
      desc: [
        `El curso Scrum Fundamentals Certified (SFC™) de SCRUMstudy introduce Scrum y da una
        comprensión básica de cómo funciona el marco para entregar proyectos exitosos. Cubre
        los conceptos clave y la estructura del flujo de Scrum, incluidos los roles de Product
        Owner, Scrum Master y equipo Scrum, y cómo se entregan las historias de usuario a través
        de Sprints. Se basa en la Guía SBOK®, y sirve para cualquier persona interesada en Scrum,
        sin importar su industria o la complejidad de sus proyectos.`,
      ],
    },
    5: {
      date: "Octubre 2023",
      category: "Certificado",
      title: "Introducción a la ciencia de datos",
      desc: [
        `El curso "Introduction to Data Science" de Cisco Networking Academy es una introducción
        gratuita a la ciencia de datos, disponible en la plataforma Skills for All y pensada para
        principiantes con curiosidad por el tema. Permite explorar el campo a alto nivel de forma
        intuitiva e interactiva, y forma parte del compromiso de Cisco de acercar tecnología y
        conocimiento a agentes de cambio social.`,
      ],
    },
    6: {
      date: "Septiembre 2023",
      category: "Certificado",
      title: "Introducción a las Bases de Datos",
      desc: [
        `La certificación "Introducción a las Bases de Datos" del ITLA está orientada a
        principiantes que quieren aprender a crear y administrar bases de datos. El programa
        enseña las habilidades fundamentales para construir y consultar bases de datos, una
        competencia esencial en muchos roles de TI.`,
      ],
    },
    7: {
      date: "En curso",
      category: "Certificado",
      desc: [
        `La certificación PL-300 de Microsoft, "Power BI Data Analyst", está dirigida a
        profesionales que quieren demostrar su dominio de Power BI para analizar datos de
        distintas fuentes. Valida la capacidad de preparar, modelar, visualizar y analizar datos,
        así como de desplegar y mantener entregables de datos.`,
      ],
    },
    8: {
      date: "Abril 2024",
      category: "Certificado",
      desc: [
        `Cisco, en colaboración con OpenEDG Python Institute, certifica que quien obtiene esta
        insignia completó el curso Python Essentials 1 y alcanzó las credenciales de nivel
        estudiante: conoce los conceptos de programación, la sintaxis y la semántica de Python,
        y resuelve tareas esenciales de programación y desafíos de implementación con la
        biblioteca estándar.`,
      ],
    },
  },

  awards: {
    1: {
      role: "Analista de Riesgos",
      metric: "Reconocimiento a nivel de toda la empresa",
      desc: [
        `Reconocimiento otorgado por Parallax Valores (Parval) a nivel de toda la empresa por
        el desempeño sobresaliente durante 2025 en el rol de Analista de Riesgos, que abarca el
        modelado cuantitativo de riesgos, la validación de datos y la automatización de los
        reportes que respaldan las decisiones de inversión.`,
      ],
    },
  },

  books: {
    1: {
      edition: "2.ª edición",
      status: "Leído",
      topics: ["Machine Learning", "Finanzas cuantitativas", "Python", "Datos alternativos"],
      note: `Un flujo completo para convertir datos de mercado y datos alternativos en señales
      predictivas: ingeniería de variables sobre series de tiempo financieras, validación
      walk-forward y la disciplina de backtesting que mantiene honesto a un modelo fuera de
      muestra. Es lo más cercano al trabajo de riesgo cuantitativo que hago a diario.`,
    },
    2: {
      status: "Leído",
      topics: ["Deep Learning", "PyTorch", "scikit-learn", "Redes neuronales"],
      note: `Desde los estimadores clásicos hasta redes neuronales, transformers y bucles de
      entrenamiento escritos a mano en PyTorch. Es la base sobre la que construyo mis proyectos
      de deep learning, incluido el fine-tuning de transformers del pipeline de detección de
      PII.`,
    },
  },

  items: {
    1: {
      title: "Bases de datos SQL",
      description:
        "SQL gestiona bases de datos relacionales de forma eficiente con consultas, inserciones, actualizaciones y eliminaciones; es clave en el desarrollo y la administración de bases de datos.",
    },
    2: {
      description:
        "El análisis exploratorio descubre patrones y hallazgos estadísticos, y el machine learning ayuda en el modelado predictivo y la clasificación.",
    },
    3: {
      description: "Visualizaciones y dashboards interactivos con datos de múltiples fuentes.",
    },
    4: {
      description:
        "Excel permite análisis de datos complejos, con macros y VBA para automatizar tareas y hacer más eficientes los flujos de trabajo.",
    },
    5: {
      description:
        "Modelos supervisados con scikit-learn y redes neuronales con PyTorch, incluido el fine-tuning de transformers multilingües para tareas de NLP como el reconocimiento de entidades, con calibración y análisis de errores.",
    },
  },

  knoledges: [
    "Machine Learning",
    "Deep Learning",
    "Redes neuronales",
    "PyTorch",
    "Transformers / NLP",
    "Reconocimiento de entidades (NER)",
    "Fine-tuning de modelos",
    "Ingeniería de variables",
    "Evaluación y calibración de modelos",
    "Pronóstico de series de tiempo",
    "Análisis exploratorio",
    "Estadística",
    "Visualización de datos",
    "Procesos ETL",
    "Consultas SQL",
    "Programación en Python",
    "Aseguramiento de calidad de datos",
    "Riesgo financiero",
    "Modelado de VaR",
    "Simulación Monte Carlo",
    "Pruebas de estrés",
    "Cumplimiento normativo",
    "Lean Six Sigma",
  ],
};
