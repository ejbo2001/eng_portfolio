---
title: "Análisis Anti-Colisión de Pozos Petroleros 3D"
description: "Aplicación web interactiva desarrollada en Python para calcular trayectorias espaciales y automatizar la prevención de colisiones en perforación direccional."
date: 2026-03-15
draft: false
image: "./newplot.png"
info:
  - text: "Repositorio en GitHub"
    link: "https://github.com/ejbo2001/3D-directional-drilling-engine"
    icon:
      type: "lucide"
      name: "github"
  - text: "Python | Streamlit"
    icon:
      type: "lucide"
      name: "code"
---

## 🎯 Contexto y Problema (The Why)
En la perforación direccional de múltiples pozos desde una misma plataforma (pad drilling), el cálculo manual de trayectorias es un cuello de botella. Un error en la planimetría vectorial conlleva un alto riesgo de colisión entre pozos, lo que puede resultar en desastres ambientales, problemas de seguridad crítica y pérdidas millonarias.

## ⚙️ Metodología y Solución (The How)
Para mitigar este riesgo, desarrollé una aplicación web automatizada que ingiere datos crudos de encuestas direccionales (Profundidad Medida, Inclinación, Azimut) y construye el modelo espacial del pozo.

La lógica matemática del backend está fundamentada en el **Método de Curvatura Mínima (Minimum Curvature Method)**, el estándar de la industria para suavizar los segmentos esféricos entre puntos de medición, calculando coordenadas Norte, Este y Profundidad Verdadera (TVD).

### Stack Tecnológico
* **Core Matemático:** `Python`, `NumPy`, `Pandas` para limpieza y procesamiento matricial.
* **Interfaz de Usuario (UI):** `Streamlit` para el despliegue rápido de la herramienta web.
* **Renderizado:** `Plotly` para la visualización interactiva 3D.

---

## 💻 Muestra de Código: Cálculo Vectorial
A continuación, un fragmento de la lógica central utilizada para iterar sobre los datos direccionales y calcular el factor de severidad de curvatura (Dogleg Severity - DLS), crucial para determinar el estrés mecánico en la tubería:

```python
import numpy as np

def calculate_dogleg_severity(inc1, inc2, az1, az2):
    """
    Calcula la Severidad de Pata de Perro (DLS) entre dos puntos direccionales.
    Entradas en grados, salida en ratio de curvatura.
    """
    # Conversión a radianes
    i1, i2 = np.radians(inc1), np.radians(inc2)
    a1, a2 = np.radians(az1), np.radians(az2)
    
    # Cálculo del ángulo tridimensional (Dogleg)
    cos_dl = np.cos(i2 - i1) - np.sin(i1) * np.sin(i2) * (1 - np.cos(a2 - a1))
    
    # Prevención de errores de dominio de coma flotante
    cos_dl = np.clip(cos_dl, -1.0, 1.0)
    
    return np.degrees(np.arccos(cos_dl))
```
##  📊 Impacto del Proyecto (The Result)
Reducción de Tiempo: Transformó un proceso de cálculo y validación manual de horas a una ejecución de segundos.

Toma de Decisiones: La integración del visor 3D permite a los ingenieros de perforación auditar visualmente las zonas de tolerancia (Separation Factor) en tiempo real.

Escalabilidad: El código está modularizado, lo que permite la futura integración de bases de datos en la nube o sensores MWD (Measurement While Drilling) en tiempo real.


