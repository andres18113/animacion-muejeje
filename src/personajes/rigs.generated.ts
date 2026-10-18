// generado por scripts/generar-rigs.mjs; no editar
import type { MascotaId } from "../mascotas/catalogo.ts";
import type { Rig } from "./tipos.ts";

export const RIGS: Record<MascotaId, Rig> = {
  "voltio": {
    "id": "voltio",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 311 C91 302 72 317 76 345",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 311
        },
        "control1": {
          "x": 91,
          "y": 302
        },
        "control2": {
          "x": 72,
          "y": 317
        },
        "fin": {
          "x": 76,
          "y": 345
        },
        "mano": {
          "cx": 76,
          "cy": 345,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 311 C424 320 435 339 426 353",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 311
        },
        "control1": {
          "x": 424,
          "y": 320
        },
        "control2": {
          "x": 435,
          "y": 339
        },
        "fin": {
          "x": 426,
          "y": 353
        },
        "mano": {
          "cx": 426,
          "cy": 353,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<rect x=\"116\" y=\"128\" width=\"286\" height=\"266\" rx=\"27\" fill=\"#D6E3E9\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"133\" y=\"145\" width=\"250\" height=\"226\" rx=\"18\" fill=\"#EEF2F0\" stroke=\"#22344A\" stroke-width=\"4\" /><g transform=\"translate(178 188) scale(0.7) translate(-202 -214)\"><circle cx=\"202\" cy=\"214\" r=\"48\" fill=\"#BDD1D6\" stroke=\"#22344A\" stroke-width=\"5\" /><circle cx=\"202\" cy=\"214\" r=\"38\" fill=\"#8999A4\" stroke=\"#22344A\" stroke-width=\"3\" /><path d=\"M209.0 214.0 L238.0 214.0\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M206.9 218.9 L227.5 239.5\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M202.0 221.0 L202.0 250.0\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M197.1 218.9 L176.5 239.5\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M195.0 214.0 L166.0 214.0\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M197.1 209.1 L176.5 188.5\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M202.0 207.0 L202.0 178.0\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M206.9 209.1 L227.5 188.5\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><circle cx=\"202\" cy=\"214\" r=\"8\" fill=\"#D6E6E8\" stroke=\"#22344A\" stroke-width=\"4\" /></g><rect x=\"318\" y=\"158\" width=\"50\" height=\"40\" rx=\"7\" fill=\"#778A9A\" stroke=\"#22344A\" stroke-width=\"6\" /><circle cx=\"343\" cy=\"178\" r=\"6\" fill=\"#20334A\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"259\" y=\"366\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"27\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">ATX</text><circle cx=\"363\" cy=\"346\" r=\"10\" fill=\"#6DBB8B\" stroke=\"#22344A\" stroke-width=\"4\" />",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<rect x=\"116\" y=\"128\" width=\"286\" height=\"266\" rx=\"27\" fill=\"#D6E3E9\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"133\" y=\"145\" width=\"250\" height=\"226\" rx=\"18\" fill=\"#EEF2F0\" stroke=\"#22344A\" stroke-width=\"4\" />"
      },
      {
        "tipo": "ventilador",
        "markup": "<g transform=\"translate(178 188) scale(0.7) translate(-202 -214)\"><circle cx=\"202\" cy=\"214\" r=\"48\" fill=\"#BDD1D6\" stroke=\"#22344A\" stroke-width=\"5\" /><circle cx=\"202\" cy=\"214\" r=\"38\" fill=\"#8999A4\" stroke=\"#22344A\" stroke-width=\"3\" /><path d=\"M209.0 214.0 L238.0 214.0\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M206.9 218.9 L227.5 239.5\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M202.0 221.0 L202.0 250.0\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M197.1 218.9 L176.5 239.5\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M195.0 214.0 L166.0 214.0\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M197.1 209.1 L176.5 188.5\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M202.0 207.0 L202.0 178.0\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M206.9 209.1 L227.5 188.5\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><circle cx=\"202\" cy=\"214\" r=\"8\" fill=\"#D6E6E8\" stroke=\"#22344A\" stroke-width=\"4\" /></g>"
      },
      {
        "tipo": "estatico",
        "markup": "<rect x=\"318\" y=\"158\" width=\"50\" height=\"40\" rx=\"7\" fill=\"#778A9A\" stroke=\"#22344A\" stroke-width=\"6\" /><circle cx=\"343\" cy=\"178\" r=\"6\" fill=\"#20334A\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"259\" y=\"366\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"27\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">ATX</text><circle cx=\"363\" cy=\"346\" r=\"10\" fill=\"#6DBB8B\" stroke=\"#22344A\" stroke-width=\"4\" />"
      }
    ],
    "partes": {
      "ventilador": {
        "markup": "<circle cx=\"202\" cy=\"214\" r=\"48\" fill=\"#BDD1D6\" stroke=\"#22344A\" stroke-width=\"5\" /><circle cx=\"202\" cy=\"214\" r=\"38\" fill=\"#8999A4\" stroke=\"#22344A\" stroke-width=\"3\" /><path d=\"M209.0 214.0 L238.0 214.0\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M206.9 218.9 L227.5 239.5\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M202.0 221.0 L202.0 250.0\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M197.1 218.9 L176.5 239.5\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M195.0 214.0 L166.0 214.0\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M197.1 209.1 L176.5 188.5\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M202.0 207.0 L202.0 178.0\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M206.9 209.1 L227.5 188.5\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><circle cx=\"202\" cy=\"214\" r=\"8\" fill=\"#D6E6E8\" stroke=\"#22344A\" stroke-width=\"4\" />",
        "transformacion": "translate(178 188) scale(0.7) translate(-202 -214)",
        "centro": {
          "x": 202,
          "y": 214
        }
      }
    },
    "rostro": {
      "transformacion": "",
      "desplazamiento": {
        "x": 0,
        "y": 0
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 235,
          "cy": 268,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 238,
          "cy": 272,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 241,
          "cy": 266,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 297,
          "cy": 268,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 300,
          "cy": 272,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 303,
          "cy": 266,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M220 228 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 220,
          "y": 228
        },
        "control": {
          "x": 233,
          "y": 219
        },
        "fin": {
          "x": 247,
          "y": 227
        }
      },
      {
        "d": "M285 228 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 285,
          "y": 228
        },
        "control": {
          "x": 297,
          "y": 220
        },
        "fin": {
          "x": 311,
          "y": 229
        }
      }
    ],
    "mejillas": [
      {
        "cx": 201,
        "cy": 299,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 331,
        "cy": 299,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M243 309 Q266 337 289 309",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 243,
        "y": 309
      },
      "control": {
        "x": 266,
        "y": 337
      },
      "fin": {
        "x": 289,
        "y": 309
      }
    },
    "hablando": {
      "boca": {
        "cx": 266,
        "cy": 316,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M256 326 Q266 317 275 326",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 256,
          "y": 326
        },
        "control": {
          "x": 266,
          "y": 317
        },
        "fin": {
          "x": 275,
          "y": 326
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 266,
        "cy": 317,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M221 229 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 221,
            "y": 229
          },
          "control": {
            "x": 233.5,
            "y": 225
          },
          "fin": {
            "x": 246,
            "y": 221
          }
        },
        {
          "d": "M287 221 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 287,
            "y": 221
          },
          "control": {
            "x": 299,
            "y": 225
          },
          "fin": {
            "x": 311,
            "y": 229
          }
        }
      ]
    }
  },
  "pulso": {
    "id": "pulso",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 300 C91 291 72 306 76 334",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 300
        },
        "control1": {
          "x": 91,
          "y": 291
        },
        "control2": {
          "x": 72,
          "y": 306
        },
        "fin": {
          "x": 76,
          "y": 334
        },
        "mano": {
          "cx": 76,
          "cy": 334,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 300 C424 309 435 328 426 342",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 300
        },
        "control1": {
          "x": 424,
          "y": 309
        },
        "control2": {
          "x": 435,
          "y": 328
        },
        "fin": {
          "x": 426,
          "y": 342
        },
        "mano": {
          "cx": 426,
          "cy": 342,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<rect x=\"131\" y=\"297\" width=\"250\" height=\"112\" rx=\"22\" fill=\"#ABB7C0\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"147\" y=\"314\" width=\"218\" height=\"71\" rx=\"15\" fill=\"#DCE1E2\" stroke=\"#22344A\" stroke-width=\"5\" /><circle cx=\"256\" cy=\"220\" r=\"107\" fill=\"#DC8069\" stroke=\"#22344A\" stroke-width=\"7\" /><circle cx=\"256\" cy=\"225\" r=\"90\" fill=\"#F6A18A\" stroke=\"#22344A\" stroke-width=\"5\" /><path d=\"M199 154 Q256 126 313 154\" fill=\"none\" stroke=\"#FFE0CA\" stroke-width=\"13\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><text x=\"256\" y=\"372\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"21\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">PWR</text>",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<rect x=\"131\" y=\"297\" width=\"250\" height=\"112\" rx=\"22\" fill=\"#ABB7C0\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"147\" y=\"314\" width=\"218\" height=\"71\" rx=\"15\" fill=\"#DCE1E2\" stroke=\"#22344A\" stroke-width=\"5\" />"
      },
      {
        "tipo": "boton",
        "markup": "<circle cx=\"256\" cy=\"220\" r=\"107\" fill=\"#DC8069\" stroke=\"#22344A\" stroke-width=\"7\" /><circle cx=\"256\" cy=\"225\" r=\"90\" fill=\"#F6A18A\" stroke=\"#22344A\" stroke-width=\"5\" /><path d=\"M199 154 Q256 126 313 154\" fill=\"none\" stroke=\"#FFE0CA\" stroke-width=\"13\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />"
      },
      {
        "tipo": "estatico",
        "markup": "<text x=\"256\" y=\"372\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"21\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">PWR</text>"
      }
    ],
    "partes": {
      "boton": {
        "markup": "<circle cx=\"256\" cy=\"220\" r=\"107\" fill=\"#DC8069\" stroke=\"#22344A\" stroke-width=\"7\" /><circle cx=\"256\" cy=\"225\" r=\"90\" fill=\"#F6A18A\" stroke=\"#22344A\" stroke-width=\"5\" /><path d=\"M199 154 Q256 126 313 154\" fill=\"none\" stroke=\"#FFE0CA\" stroke-width=\"13\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />",
        "transformacion": "",
        "centro": {
          "x": 256,
          "y": 327
        }
      }
    },
    "rostro": {
      "transformacion": "",
      "desplazamiento": {
        "x": 0,
        "y": 0
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 225,
          "cy": 206,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 228,
          "cy": 210,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 231,
          "cy": 204,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 287,
          "cy": 206,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 290,
          "cy": 210,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 293,
          "cy": 204,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M210 166 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 210,
          "y": 166
        },
        "control": {
          "x": 223,
          "y": 157
        },
        "fin": {
          "x": 237,
          "y": 165
        }
      },
      {
        "d": "M275 166 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 275,
          "y": 166
        },
        "control": {
          "x": 287,
          "y": 158
        },
        "fin": {
          "x": 301,
          "y": 167
        }
      }
    ],
    "mejillas": [
      {
        "cx": 191,
        "cy": 237,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 321,
        "cy": 237,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M233 247 Q256 275 279 247",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 233,
        "y": 247
      },
      "control": {
        "x": 256,
        "y": 275
      },
      "fin": {
        "x": 279,
        "y": 247
      }
    },
    "hablando": {
      "boca": {
        "cx": 256,
        "cy": 254,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M246 264 Q256 255 265 264",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 246,
          "y": 264
        },
        "control": {
          "x": 256,
          "y": 255
        },
        "fin": {
          "x": 265,
          "y": 264
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 256,
        "cy": 255,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M211 167 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 211,
            "y": 167
          },
          "control": {
            "x": 223.5,
            "y": 163
          },
          "fin": {
            "x": 236,
            "y": 159
          }
        },
        {
          "d": "M277 159 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 277,
            "y": 159
          },
          "control": {
            "x": 289,
            "y": 163
          },
          "fin": {
            "x": 301,
            "y": 167
          }
        }
      ]
    }
  },
  "secu": {
    "id": "secu",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 311 C91 302 72 317 76 345",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 311
        },
        "control1": {
          "x": 91,
          "y": 302
        },
        "control2": {
          "x": 72,
          "y": 317
        },
        "fin": {
          "x": 76,
          "y": 345
        },
        "mano": {
          "cx": 76,
          "cy": 345,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 311 C424 320 435 339 426 353",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 311
        },
        "control1": {
          "x": 424,
          "y": 320
        },
        "control2": {
          "x": 435,
          "y": 339
        },
        "fin": {
          "x": 426,
          "y": 353
        },
        "mano": {
          "cx": 426,
          "cy": 353,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<rect x=\"112\" y=\"123\" width=\"289\" height=\"286\" rx=\"22\" fill=\"#6FA796\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"126\" y=\"136\" width=\"261\" height=\"260\" rx=\"15\" fill=\"#90C9AC\" stroke=\"#22344A\" stroke-width=\"4\" /><rect x=\"154\" y=\"162\" width=\"33\" height=\"26\" rx=\"4\" fill=\"#3F685B\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"241\" y=\"356\" width=\"32\" height=\"22\" rx=\"4\" fill=\"#3F685B\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"318\" y=\"162\" width=\"36\" height=\"27\" rx=\"4\" fill=\"#3F685B\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"160\" y=\"350\" width=\"29\" height=\"23\" rx=\"4\" fill=\"#3F685B\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"330\" y=\"354\" width=\"30\" height=\"23\" rx=\"4\" fill=\"#3F685B\" stroke=\"#22344A\" stroke-width=\"3\" /><path d=\"M165 198 v8 h-15\" fill=\"none\" stroke=\"#D4E4AD\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M213 198 v8 h-15\" fill=\"none\" stroke=\"#D4E4AD\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M261 198 v8 h-15\" fill=\"none\" stroke=\"#D4E4AD\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M309 198 v8 h-15\" fill=\"none\" stroke=\"#D4E4AD\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M357 198 v8 h-15\" fill=\"none\" stroke=\"#D4E4AD\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><rect x=\"181\" y=\"212\" width=\"150\" height=\"138\" rx=\"18\" fill=\"#38645E\" stroke=\"#22344A\" stroke-width=\"6\" /><text x=\"254\" y=\"181\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"21\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#F3FBEB\">RESET</text><circle cx=\"363\" cy=\"210\" r=\"10\" fill=\"#F3D076\" stroke=\"#22344A\" stroke-width=\"3\" />",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<rect x=\"112\" y=\"123\" width=\"289\" height=\"286\" rx=\"22\" fill=\"#6FA796\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"126\" y=\"136\" width=\"261\" height=\"260\" rx=\"15\" fill=\"#90C9AC\" stroke=\"#22344A\" stroke-width=\"4\" /><rect x=\"154\" y=\"162\" width=\"33\" height=\"26\" rx=\"4\" fill=\"#3F685B\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"241\" y=\"356\" width=\"32\" height=\"22\" rx=\"4\" fill=\"#3F685B\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"318\" y=\"162\" width=\"36\" height=\"27\" rx=\"4\" fill=\"#3F685B\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"160\" y=\"350\" width=\"29\" height=\"23\" rx=\"4\" fill=\"#3F685B\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"330\" y=\"354\" width=\"30\" height=\"23\" rx=\"4\" fill=\"#3F685B\" stroke=\"#22344A\" stroke-width=\"3\" /><path d=\"M165 198 v8 h-15\" fill=\"none\" stroke=\"#D4E4AD\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M213 198 v8 h-15\" fill=\"none\" stroke=\"#D4E4AD\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M261 198 v8 h-15\" fill=\"none\" stroke=\"#D4E4AD\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M309 198 v8 h-15\" fill=\"none\" stroke=\"#D4E4AD\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M357 198 v8 h-15\" fill=\"none\" stroke=\"#D4E4AD\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><rect x=\"181\" y=\"212\" width=\"150\" height=\"138\" rx=\"18\" fill=\"#38645E\" stroke=\"#22344A\" stroke-width=\"6\" /><text x=\"254\" y=\"181\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"21\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#F3FBEB\">RESET</text>"
      },
      {
        "tipo": "led",
        "markup": "<circle cx=\"363\" cy=\"210\" r=\"10\" fill=\"#F3D076\" stroke=\"#22344A\" stroke-width=\"3\" />"
      },
      {
        "tipo": "estatico",
        "markup": ""
      }
    ],
    "partes": {
      "led": {
        "markup": "<circle cx=\"363\" cy=\"210\" r=\"10\" fill=\"#F3D076\" stroke=\"#22344A\" stroke-width=\"3\" />",
        "transformacion": "",
        "centro": {
          "x": 363,
          "y": 210
        }
      }
    },
    "rostro": {
      "transformacion": "",
      "desplazamiento": {
        "x": 0,
        "y": 0
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 223,
          "cy": 269,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 226,
          "cy": 273,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 229,
          "cy": 267,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 285,
          "cy": 269,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 288,
          "cy": 273,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 291,
          "cy": 267,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M208 229 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 208,
          "y": 229
        },
        "control": {
          "x": 221,
          "y": 220
        },
        "fin": {
          "x": 235,
          "y": 228
        }
      },
      {
        "d": "M273 229 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 273,
          "y": 229
        },
        "control": {
          "x": 285,
          "y": 221
        },
        "fin": {
          "x": 299,
          "y": 230
        }
      }
    ],
    "mejillas": [
      {
        "cx": 189,
        "cy": 300,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 319,
        "cy": 300,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M231 310 Q254 338 277 310",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 231,
        "y": 310
      },
      "control": {
        "x": 254,
        "y": 338
      },
      "fin": {
        "x": 277,
        "y": 310
      }
    },
    "hablando": {
      "boca": {
        "cx": 254,
        "cy": 317,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M244 327 Q254 318 263 327",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 244,
          "y": 327
        },
        "control": {
          "x": 254,
          "y": 318
        },
        "fin": {
          "x": 263,
          "y": 327
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 254,
        "cy": 318,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M209 230 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 209,
            "y": 230
          },
          "control": {
            "x": 221.5,
            "y": 226
          },
          "fin": {
            "x": 234,
            "y": 222
          }
        },
        {
          "d": "M275 222 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 275,
            "y": 222
          },
          "control": {
            "x": 287,
            "y": 226
          },
          "fin": {
            "x": 299,
            "y": 230
          }
        }
      ]
    }
  },
  "cipu": {
    "id": "cipu",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 311 C91 302 72 317 76 345",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 311
        },
        "control1": {
          "x": 91,
          "y": 302
        },
        "control2": {
          "x": 72,
          "y": 317
        },
        "fin": {
          "x": 76,
          "y": 345
        },
        "mano": {
          "cx": 76,
          "cy": 345,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 311 C424 320 435 339 426 353",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 311
        },
        "control1": {
          "x": 424,
          "y": 320
        },
        "control2": {
          "x": 435,
          "y": 339
        },
        "fin": {
          "x": 426,
          "y": 353
        },
        "mano": {
          "cx": 426,
          "cy": 353,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<rect x=\"133\" y=\"111\" width=\"243\" height=\"290\" rx=\"19\" fill=\"#334C67\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"148\" y=\"130\" width=\"214\" height=\"244\" rx=\"15\" fill=\"#506A84\" stroke=\"#22344A\" stroke-width=\"5\" /><rect x=\"165\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"181\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"197\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"213\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"229\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"245\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"261\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"277\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"293\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"309\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"325\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"341\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"357\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"164\" y=\"151\" width=\"182\" height=\"50\" rx=\"6\" fill=\"#20344B\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"254\" y=\"183\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"19\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#F1E8D8\">PENTIUM II</text><path d=\"M163 209 h184\" fill=\"none\" stroke=\"#91C6CF\" stroke-width=\"7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<rect x=\"133\" y=\"111\" width=\"243\" height=\"290\" rx=\"19\" fill=\"#334C67\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"148\" y=\"130\" width=\"214\" height=\"244\" rx=\"15\" fill=\"#506A84\" stroke=\"#22344A\" stroke-width=\"5\" /><rect x=\"165\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"181\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"197\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"213\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"229\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"245\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"261\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"277\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"293\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"309\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"325\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"341\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"357\" y=\"382\" width=\"9\" height=\"31\" rx=\"2\" fill=\"#D5AF64\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"164\" y=\"151\" width=\"182\" height=\"50\" rx=\"6\" fill=\"#20344B\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"254\" y=\"183\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"19\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#F1E8D8\">PENTIUM II</text><path d=\"M163 209 h184\" fill=\"none\" stroke=\"#91C6CF\" stroke-width=\"7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />"
      }
    ],
    "partes": {},
    "rostro": {
      "transformacion": "translate(0 8)",
      "desplazamiento": {
        "x": 0,
        "y": 8
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 224,
          "cy": 257,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 227,
          "cy": 261,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 230,
          "cy": 255,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 286,
          "cy": 257,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 289,
          "cy": 261,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 292,
          "cy": 255,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M209 217 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 209,
          "y": 217
        },
        "control": {
          "x": 222,
          "y": 208
        },
        "fin": {
          "x": 236,
          "y": 216
        }
      },
      {
        "d": "M274 217 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 274,
          "y": 217
        },
        "control": {
          "x": 286,
          "y": 209
        },
        "fin": {
          "x": 300,
          "y": 218
        }
      }
    ],
    "mejillas": [
      {
        "cx": 190,
        "cy": 288,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 320,
        "cy": 288,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M232 298 Q255 326 278 298",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 232,
        "y": 298
      },
      "control": {
        "x": 255,
        "y": 326
      },
      "fin": {
        "x": 278,
        "y": 298
      }
    },
    "hablando": {
      "boca": {
        "cx": 255,
        "cy": 305,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M245 315 Q255 306 264 315",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 245,
          "y": 315
        },
        "control": {
          "x": 255,
          "y": 306
        },
        "fin": {
          "x": 264,
          "y": 315
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 255,
        "cy": 306,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M210 218 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 210,
            "y": 218
          },
          "control": {
            "x": 222.5,
            "y": 214
          },
          "fin": {
            "x": 235,
            "y": 210
          }
        },
        {
          "d": "M276 210 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 276,
            "y": 210
          },
          "control": {
            "x": 288,
            "y": 214
          },
          "fin": {
            "x": 300,
            "y": 218
          }
        }
      ]
    }
  },
  "romi": {
    "id": "romi",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 311 C91 302 72 317 76 345",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 311
        },
        "control1": {
          "x": 91,
          "y": 302
        },
        "control2": {
          "x": 72,
          "y": 317
        },
        "fin": {
          "x": 76,
          "y": 345
        },
        "mano": {
          "cx": 76,
          "cy": 345,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 311 C424 320 435 339 426 353",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 311
        },
        "control1": {
          "x": 424,
          "y": 320
        },
        "control2": {
          "x": 435,
          "y": 339
        },
        "fin": {
          "x": 426,
          "y": 353
        },
        "mano": {
          "cx": 426,
          "cy": 353,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<rect x=\"154\" y=\"121\" width=\"207\" height=\"280\" rx=\"16\" fill=\"#343D51\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"131\" y=\"155\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"155\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"176\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"176\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"197\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"197\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"218\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"218\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"239\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"239\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"260\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"260\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"281\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"281\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"302\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"302\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"323\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"323\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"344\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"344\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"365\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"365\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"170\" y=\"136\" width=\"175\" height=\"247\" rx=\"12\" fill=\"#596478\" stroke=\"#22344A\" stroke-width=\"4\" /><circle cx=\"184\" cy=\"155\" r=\"7\" fill=\"#202B38\" stroke=\"#22344A\" stroke-width=\"1\" /><text x=\"256\" y=\"191\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"25\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#FFFFFF\">4 Mbit</text>",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<rect x=\"154\" y=\"121\" width=\"207\" height=\"280\" rx=\"16\" fill=\"#343D51\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"131\" y=\"155\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"155\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"176\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"176\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"197\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"197\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"218\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"218\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"239\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"239\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"260\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"260\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"281\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"281\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"302\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"302\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"323\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"323\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"344\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"344\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"131\" y=\"365\" width=\"23\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"361\" y=\"365\" width=\"22\" height=\"10\" rx=\"2\" fill=\"#D5CFB6\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"170\" y=\"136\" width=\"175\" height=\"247\" rx=\"12\" fill=\"#596478\" stroke=\"#22344A\" stroke-width=\"4\" /><circle cx=\"184\" cy=\"155\" r=\"7\" fill=\"#202B38\" stroke=\"#22344A\" stroke-width=\"1\" /><text x=\"256\" y=\"191\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"25\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#FFFFFF\">4 Mbit</text>"
      }
    ],
    "partes": {},
    "rostro": {
      "transformacion": "",
      "desplazamiento": {
        "x": 0,
        "y": 0
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 226,
          "cy": 268,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 229,
          "cy": 272,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 232,
          "cy": 266,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 288,
          "cy": 268,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 291,
          "cy": 272,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 294,
          "cy": 266,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M211 228 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 211,
          "y": 228
        },
        "control": {
          "x": 224,
          "y": 219
        },
        "fin": {
          "x": 238,
          "y": 227
        }
      },
      {
        "d": "M276 228 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 276,
          "y": 228
        },
        "control": {
          "x": 288,
          "y": 220
        },
        "fin": {
          "x": 302,
          "y": 229
        }
      }
    ],
    "mejillas": [
      {
        "cx": 192,
        "cy": 299,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 322,
        "cy": 299,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M234 309 Q257 337 280 309",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 234,
        "y": 309
      },
      "control": {
        "x": 257,
        "y": 337
      },
      "fin": {
        "x": 280,
        "y": 309
      }
    },
    "hablando": {
      "boca": {
        "cx": 257,
        "cy": 316,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M247 326 Q257 317 266 326",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 247,
          "y": 326
        },
        "control": {
          "x": 257,
          "y": 317
        },
        "fin": {
          "x": 266,
          "y": 326
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 257,
        "cy": 317,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M212 229 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 212,
            "y": 229
          },
          "control": {
            "x": 224.5,
            "y": 225
          },
          "fin": {
            "x": 237,
            "y": 221
          }
        },
        {
          "d": "M278 221 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 278,
            "y": 221
          },
          "control": {
            "x": 290,
            "y": 225
          },
          "fin": {
            "x": 302,
            "y": 229
          }
        }
      ]
    }
  },
  "bios": {
    "id": "bios",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 311 C91 302 72 317 76 345",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 311
        },
        "control1": {
          "x": 91,
          "y": 302
        },
        "control2": {
          "x": 72,
          "y": 317
        },
        "fin": {
          "x": 76,
          "y": 345
        },
        "mano": {
          "cx": 76,
          "cy": 345,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 311 C424 320 435 339 426 353",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 311
        },
        "control1": {
          "x": 424,
          "y": 320
        },
        "control2": {
          "x": 435,
          "y": 339
        },
        "fin": {
          "x": 426,
          "y": 353
        },
        "mano": {
          "cx": 426,
          "cy": 353,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<rect x=\"115\" y=\"132\" width=\"284\" height=\"264\" rx=\"21\" fill=\"#8C92D0\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"131\" y=\"148\" width=\"253\" height=\"231\" rx=\"11\" fill=\"#B7B9ED\" stroke=\"#22344A\" stroke-width=\"4\" /><rect x=\"147\" y=\"161\" width=\"223\" height=\"58\" rx=\"6\" fill=\"#273D5D\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"256\" y=\"199\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"30\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#F5F8FF\">BIOS</text><path d=\"M161 237 h40 M161 252 h34 M333 240 h19\" fill=\"none\" stroke=\"#547B99\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<rect x=\"115\" y=\"132\" width=\"284\" height=\"264\" rx=\"21\" fill=\"#8C92D0\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"131\" y=\"148\" width=\"253\" height=\"231\" rx=\"11\" fill=\"#B7B9ED\" stroke=\"#22344A\" stroke-width=\"4\" /><rect x=\"147\" y=\"161\" width=\"223\" height=\"58\" rx=\"6\" fill=\"#273D5D\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"256\" y=\"199\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"30\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#F5F8FF\">BIOS</text><path d=\"M161 237 h40 M161 252 h34 M333 240 h19\" fill=\"none\" stroke=\"#547B99\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />"
      }
    ],
    "partes": {},
    "rostro": {
      "transformacion": "",
      "desplazamiento": {
        "x": 0,
        "y": 0
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 224,
          "cy": 276,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 227,
          "cy": 280,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 230,
          "cy": 274,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 286,
          "cy": 276,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 289,
          "cy": 280,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 292,
          "cy": 274,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M209 236 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 209,
          "y": 236
        },
        "control": {
          "x": 222,
          "y": 227
        },
        "fin": {
          "x": 236,
          "y": 235
        }
      },
      {
        "d": "M274 236 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 274,
          "y": 236
        },
        "control": {
          "x": 286,
          "y": 228
        },
        "fin": {
          "x": 300,
          "y": 237
        }
      }
    ],
    "mejillas": [
      {
        "cx": 190,
        "cy": 307,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 320,
        "cy": 307,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M232 317 Q255 345 278 317",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 232,
        "y": 317
      },
      "control": {
        "x": 255,
        "y": 345
      },
      "fin": {
        "x": 278,
        "y": 317
      }
    },
    "hablando": {
      "boca": {
        "cx": 255,
        "cy": 324,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M245 334 Q255 325 264 334",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 245,
          "y": 334
        },
        "control": {
          "x": 255,
          "y": 325
        },
        "fin": {
          "x": 264,
          "y": 334
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 255,
        "cy": 325,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M210 237 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 210,
            "y": 237
          },
          "control": {
            "x": 222.5,
            "y": 233
          },
          "fin": {
            "x": 235,
            "y": 229
          }
        },
        {
          "d": "M276 229 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 276,
            "y": 229
          },
          "control": {
            "x": 288,
            "y": 233
          },
          "fin": {
            "x": 300,
            "y": 237
          }
        }
      ]
    }
  },
  "cmosi": {
    "id": "cmosi",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 311 C91 302 72 317 76 345",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 311
        },
        "control1": {
          "x": 91,
          "y": 302
        },
        "control2": {
          "x": 72,
          "y": 317
        },
        "fin": {
          "x": 76,
          "y": 345
        },
        "mano": {
          "cx": 76,
          "cy": 345,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 311 C424 320 435 339 426 353",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 311
        },
        "control1": {
          "x": 424,
          "y": 320
        },
        "control2": {
          "x": 435,
          "y": 339
        },
        "fin": {
          "x": 426,
          "y": 353
        },
        "mano": {
          "cx": 426,
          "cy": 353,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<circle cx=\"161\" cy=\"177\" r=\"65\" fill=\"#D1D2CF\" stroke=\"#22344A\" stroke-width=\"7\" /><circle cx=\"161\" cy=\"177\" r=\"50\" fill=\"#F4F1DD\" stroke=\"#22344A\" stroke-width=\"4\" /><text x=\"161\" y=\"186\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"19\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">3V</text><rect x=\"138\" y=\"163\" width=\"247\" height=\"236\" rx=\"17\" fill=\"#6A7D83\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"155\" y=\"178\" width=\"213\" height=\"204\" rx=\"12\" fill=\"#C1CFBF\" stroke=\"#22344A\" stroke-width=\"4\" /><text x=\"265\" y=\"216\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">CMOS</text><rect x=\"123\" y=\"245\" width=\"16\" height=\"9\" rx=\"2\" fill=\"#D4C89C\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"385\" y=\"245\" width=\"15\" height=\"9\" rx=\"2\" fill=\"#D4C89C\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"123\" y=\"355\" width=\"16\" height=\"9\" rx=\"2\" fill=\"#D4C89C\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"385\" y=\"355\" width=\"15\" height=\"9\" rx=\"2\" fill=\"#D4C89C\" stroke=\"#22344A\" stroke-width=\"3\" />",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<circle cx=\"161\" cy=\"177\" r=\"65\" fill=\"#D1D2CF\" stroke=\"#22344A\" stroke-width=\"7\" /><circle cx=\"161\" cy=\"177\" r=\"50\" fill=\"#F4F1DD\" stroke=\"#22344A\" stroke-width=\"4\" /><text x=\"161\" y=\"186\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"19\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">3V</text><rect x=\"138\" y=\"163\" width=\"247\" height=\"236\" rx=\"17\" fill=\"#6A7D83\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"155\" y=\"178\" width=\"213\" height=\"204\" rx=\"12\" fill=\"#C1CFBF\" stroke=\"#22344A\" stroke-width=\"4\" /><text x=\"265\" y=\"216\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">CMOS</text><rect x=\"123\" y=\"245\" width=\"16\" height=\"9\" rx=\"2\" fill=\"#D4C89C\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"385\" y=\"245\" width=\"15\" height=\"9\" rx=\"2\" fill=\"#D4C89C\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"123\" y=\"355\" width=\"16\" height=\"9\" rx=\"2\" fill=\"#D4C89C\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"385\" y=\"355\" width=\"15\" height=\"9\" rx=\"2\" fill=\"#D4C89C\" stroke=\"#22344A\" stroke-width=\"3\" />"
      }
    ],
    "partes": {},
    "rostro": {
      "transformacion": "",
      "desplazamiento": {
        "x": 0,
        "y": 0
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 234,
          "cy": 279,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 237,
          "cy": 283,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 240,
          "cy": 277,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 296,
          "cy": 279,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 299,
          "cy": 283,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 302,
          "cy": 277,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M219 239 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 219,
          "y": 239
        },
        "control": {
          "x": 232,
          "y": 230
        },
        "fin": {
          "x": 246,
          "y": 238
        }
      },
      {
        "d": "M284 239 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 284,
          "y": 239
        },
        "control": {
          "x": 296,
          "y": 231
        },
        "fin": {
          "x": 310,
          "y": 240
        }
      }
    ],
    "mejillas": [
      {
        "cx": 200,
        "cy": 310,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 330,
        "cy": 310,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M242 320 Q265 348 288 320",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 242,
        "y": 320
      },
      "control": {
        "x": 265,
        "y": 348
      },
      "fin": {
        "x": 288,
        "y": 320
      }
    },
    "hablando": {
      "boca": {
        "cx": 265,
        "cy": 327,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M255 337 Q265 328 274 337",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 255,
          "y": 337
        },
        "control": {
          "x": 265,
          "y": 328
        },
        "fin": {
          "x": 274,
          "y": 337
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 265,
        "cy": 328,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M220 240 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 220,
            "y": 240
          },
          "control": {
            "x": 232.5,
            "y": 236
          },
          "fin": {
            "x": 245,
            "y": 232
          }
        },
        {
          "d": "M286 232 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 286,
            "y": 232
          },
          "control": {
            "x": 298,
            "y": 236
          },
          "fin": {
            "x": 310,
            "y": 240
          }
        }
      ]
    }
  },
  "spedi": {
    "id": "spedi",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 311 C91 302 72 317 76 345",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 311
        },
        "control1": {
          "x": 91,
          "y": 302
        },
        "control2": {
          "x": 72,
          "y": 317
        },
        "fin": {
          "x": 76,
          "y": 345
        },
        "mano": {
          "cx": 76,
          "cy": 345,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 311 C424 320 435 339 426 353",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 311
        },
        "control1": {
          "x": 424,
          "y": 320
        },
        "control2": {
          "x": 435,
          "y": 339
        },
        "fin": {
          "x": 426,
          "y": 353
        },
        "mano": {
          "cx": 426,
          "cy": 353,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<rect x=\"148\" y=\"140\" width=\"217\" height=\"267\" rx=\"17\" fill=\"#B68957\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"161\" y=\"151\" width=\"189\" height=\"243\" rx=\"11\" fill=\"#E9C587\" stroke=\"#22344A\" stroke-width=\"4\" /><text x=\"255\" y=\"192\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"31\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">SPD</text><rect x=\"128\" y=\"166\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"166\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"191\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"191\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"216\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"216\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"241\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"241\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"266\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"266\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"291\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"291\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"316\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"316\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"341\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"341\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"366\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"366\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><path d=\"M175 219 h26 M312 225 h22 M191 357 h24\" fill=\"none\" stroke=\"#C89450\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<rect x=\"148\" y=\"140\" width=\"217\" height=\"267\" rx=\"17\" fill=\"#B68957\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"161\" y=\"151\" width=\"189\" height=\"243\" rx=\"11\" fill=\"#E9C587\" stroke=\"#22344A\" stroke-width=\"4\" /><text x=\"255\" y=\"192\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"31\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">SPD</text><rect x=\"128\" y=\"166\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"166\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"191\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"191\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"216\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"216\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"241\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"241\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"266\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"266\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"291\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"291\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"316\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"316\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"341\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"341\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"128\" y=\"366\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"365\" y=\"366\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#E2CF95\" stroke=\"#22344A\" stroke-width=\"2\" /><path d=\"M175 219 h26 M312 225 h22 M191 357 h24\" fill=\"none\" stroke=\"#C89450\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />"
      }
    ],
    "partes": {},
    "rostro": {
      "transformacion": "",
      "desplazamiento": {
        "x": 0,
        "y": 0
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 226,
          "cy": 269,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 229,
          "cy": 273,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 232,
          "cy": 267,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 288,
          "cy": 269,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 291,
          "cy": 273,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 294,
          "cy": 267,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M211 229 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 211,
          "y": 229
        },
        "control": {
          "x": 224,
          "y": 220
        },
        "fin": {
          "x": 238,
          "y": 228
        }
      },
      {
        "d": "M276 229 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 276,
          "y": 229
        },
        "control": {
          "x": 288,
          "y": 221
        },
        "fin": {
          "x": 302,
          "y": 230
        }
      }
    ],
    "mejillas": [
      {
        "cx": 192,
        "cy": 300,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 322,
        "cy": 300,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M234 310 Q257 338 280 310",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 234,
        "y": 310
      },
      "control": {
        "x": 257,
        "y": 338
      },
      "fin": {
        "x": 280,
        "y": 310
      }
    },
    "hablando": {
      "boca": {
        "cx": 257,
        "cy": 317,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M247 327 Q257 318 266 327",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 247,
          "y": 327
        },
        "control": {
          "x": 257,
          "y": 318
        },
        "fin": {
          "x": 266,
          "y": 327
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 257,
        "cy": 318,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M212 230 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 212,
            "y": 230
          },
          "control": {
            "x": 224.5,
            "y": 226
          },
          "fin": {
            "x": 237,
            "y": 222
          }
        },
        {
          "d": "M278 222 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 278,
            "y": 222
          },
          "control": {
            "x": 290,
            "y": 226
          },
          "fin": {
            "x": 302,
            "y": 230
          }
        }
      ]
    }
  },
  "rami": {
    "id": "rami",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 300 C91 291 72 306 76 334",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 300
        },
        "control1": {
          "x": 91,
          "y": 291
        },
        "control2": {
          "x": 72,
          "y": 306
        },
        "fin": {
          "x": 76,
          "y": 334
        },
        "mano": {
          "cx": 76,
          "cy": 334,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 300 C424 309 435 328 426 342",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 300
        },
        "control1": {
          "x": 424,
          "y": 309
        },
        "control2": {
          "x": 435,
          "y": 328
        },
        "fin": {
          "x": 426,
          "y": 342
        },
        "mano": {
          "cx": 426,
          "cy": 342,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<rect x=\"63\" y=\"189\" width=\"386\" height=\"199\" rx=\"20\" fill=\"#4E9C80\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"73\" y=\"200\" width=\"365\" height=\"164\" rx=\"9\" fill=\"#75BCA0\" stroke=\"#22344A\" stroke-width=\"4\" /><rect x=\"91\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"135\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"179\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"223\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"267\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"311\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"355\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"399\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"85\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"101\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"117\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"133\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"149\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"165\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"181\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"197\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"213\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"229\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"245\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"261\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"277\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"293\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"309\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"325\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"341\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"357\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"373\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"389\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"405\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"421\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><path d=\"M258 389 v13\" fill=\"none\" stroke=\"#F5F0E6\" stroke-width=\"12\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><rect x=\"84\" y=\"329\" width=\"94\" height=\"27\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"131\" y=\"350\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"19\" font-weight=\"900\" letter-spacing=\"1\" fill=\"#FFFFFF\">PC100</text>",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<rect x=\"63\" y=\"189\" width=\"386\" height=\"199\" rx=\"20\" fill=\"#4E9C80\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"73\" y=\"200\" width=\"365\" height=\"164\" rx=\"9\" fill=\"#75BCA0\" stroke=\"#22344A\" stroke-width=\"4\" /><rect x=\"91\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"135\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"179\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"223\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"267\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"311\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"355\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"399\" y=\"205\" width=\"32\" height=\"24\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"85\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"101\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"117\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"133\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"149\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"165\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"181\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"197\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"213\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"229\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"245\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"261\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"277\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"293\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"309\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"325\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"341\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"357\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"373\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"389\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"405\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><rect x=\"421\" y=\"381\" width=\"9\" height=\"22\" rx=\"1\" fill=\"#E2BB69\" stroke=\"#22344A\" stroke-width=\"1\" /><path d=\"M258 389 v13\" fill=\"none\" stroke=\"#F5F0E6\" stroke-width=\"12\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><rect x=\"84\" y=\"329\" width=\"94\" height=\"27\" rx=\"5\" fill=\"#254A48\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"131\" y=\"350\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"19\" font-weight=\"900\" letter-spacing=\"1\" fill=\"#FFFFFF\">PC100</text>"
      }
    ],
    "partes": {},
    "rostro": {
      "transformacion": "",
      "desplazamiento": {
        "x": 0,
        "y": 0
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 229,
          "cy": 286,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 232,
          "cy": 290,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 235,
          "cy": 284,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 283,
          "cy": 286,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 286,
          "cy": 290,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 289,
          "cy": 284,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M214 246 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 246
        },
        "control": {
          "x": 227,
          "y": 237
        },
        "fin": {
          "x": 241,
          "y": 245
        }
      },
      {
        "d": "M271 246 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 271,
          "y": 246
        },
        "control": {
          "x": 283,
          "y": 238
        },
        "fin": {
          "x": 297,
          "y": 247
        }
      }
    ],
    "mejillas": [
      {
        "cx": 191,
        "cy": 317,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 321,
        "cy": 317,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M233 327 Q256 355 279 327",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 233,
        "y": 327
      },
      "control": {
        "x": 256,
        "y": 355
      },
      "fin": {
        "x": 279,
        "y": 327
      }
    },
    "hablando": {
      "boca": {
        "cx": 256,
        "cy": 334,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M246 344 Q256 335 265 344",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 246,
          "y": 344
        },
        "control": {
          "x": 256,
          "y": 335
        },
        "fin": {
          "x": 265,
          "y": 344
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 256,
        "cy": 335,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M215 247 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 215,
            "y": 247
          },
          "control": {
            "x": 227.5,
            "y": 243
          },
          "fin": {
            "x": 240,
            "y": 239
          }
        },
        {
          "d": "M273 239 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 273,
            "y": 239
          },
          "control": {
            "x": 285,
            "y": 243
          },
          "fin": {
            "x": 297,
            "y": 247
          }
        }
      ]
    }
  },
  "postin": {
    "id": "postin",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 311 C91 302 72 317 76 345",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 311
        },
        "control1": {
          "x": 91,
          "y": 302
        },
        "control2": {
          "x": 72,
          "y": 317
        },
        "fin": {
          "x": 76,
          "y": 345
        },
        "mano": {
          "cx": 76,
          "cy": 345,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 311 C424 320 435 339 426 353",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 311
        },
        "control1": {
          "x": 424,
          "y": 320
        },
        "control2": {
          "x": 435,
          "y": 339
        },
        "fin": {
          "x": 426,
          "y": 353
        },
        "mano": {
          "cx": 426,
          "cy": 353,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<rect x=\"138\" y=\"143\" width=\"249\" height=\"255\" rx=\"20\" fill=\"#E6CFAC\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"153\" y=\"159\" width=\"216\" height=\"217\" rx=\"12\" fill=\"#FFF7E8\" stroke=\"#22344A\" stroke-width=\"4\" /><rect x=\"204\" y=\"124\" width=\"115\" height=\"47\" rx=\"13\" fill=\"#8B9BA5\" stroke=\"#22344A\" stroke-width=\"8\" /><text x=\"258\" y=\"200\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"24\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">POST</text><rect x=\"198\" y=\"206\" width=\"119\" height=\"24\" rx=\"7\" fill=\"#38475C\" stroke=\"#22344A\" stroke-width=\"4\" /><text x=\"257\" y=\"224\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"16\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#A5F2BD\">28h</text><circle cx=\"360\" cy=\"216\" r=\"20\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"6\" /><path d=\"M377 230 l25 21\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<rect x=\"138\" y=\"143\" width=\"249\" height=\"255\" rx=\"20\" fill=\"#E6CFAC\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"153\" y=\"159\" width=\"216\" height=\"217\" rx=\"12\" fill=\"#FFF7E8\" stroke=\"#22344A\" stroke-width=\"4\" /><rect x=\"204\" y=\"124\" width=\"115\" height=\"47\" rx=\"13\" fill=\"#8B9BA5\" stroke=\"#22344A\" stroke-width=\"8\" /><text x=\"258\" y=\"200\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"24\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">POST</text><rect x=\"198\" y=\"206\" width=\"119\" height=\"24\" rx=\"7\" fill=\"#38475C\" stroke=\"#22344A\" stroke-width=\"4\" /><text x=\"257\" y=\"224\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"16\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#A5F2BD\">28h</text><circle cx=\"360\" cy=\"216\" r=\"20\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"6\" /><path d=\"M377 230 l25 21\" fill=\"none\" stroke=\"#22344A\" stroke-width=\"9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />"
      }
    ],
    "partes": {},
    "rostro": {
      "transformacion": "translate(0 12)",
      "desplazamiento": {
        "x": 0,
        "y": 12
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 229,
          "cy": 274,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 232,
          "cy": 278,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 235,
          "cy": 272,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 291,
          "cy": 274,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 294,
          "cy": 278,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 297,
          "cy": 272,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M214 234 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 234
        },
        "control": {
          "x": 227,
          "y": 225
        },
        "fin": {
          "x": 241,
          "y": 233
        }
      },
      {
        "d": "M279 234 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 279,
          "y": 234
        },
        "control": {
          "x": 291,
          "y": 226
        },
        "fin": {
          "x": 305,
          "y": 235
        }
      }
    ],
    "mejillas": [
      {
        "cx": 195,
        "cy": 305,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 325,
        "cy": 305,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M237 315 Q260 343 283 315",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 237,
        "y": 315
      },
      "control": {
        "x": 260,
        "y": 343
      },
      "fin": {
        "x": 283,
        "y": 315
      }
    },
    "hablando": {
      "boca": {
        "cx": 260,
        "cy": 322,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M250 332 Q260 323 269 332",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 250,
          "y": 332
        },
        "control": {
          "x": 260,
          "y": 323
        },
        "fin": {
          "x": 269,
          "y": 332
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 260,
        "cy": 323,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M215 235 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 215,
            "y": 235
          },
          "control": {
            "x": 227.5,
            "y": 231
          },
          "fin": {
            "x": 240,
            "y": 227
          }
        },
        {
          "d": "M281 227 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 281,
            "y": 227
          },
          "control": {
            "x": 293,
            "y": 231
          },
          "fin": {
            "x": 305,
            "y": 235
          }
        }
      ]
    }
  },
  "disqui": {
    "id": "disqui",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 311 C91 302 72 317 76 345",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 311
        },
        "control1": {
          "x": 91,
          "y": 302
        },
        "control2": {
          "x": 72,
          "y": 317
        },
        "fin": {
          "x": 76,
          "y": 345
        },
        "mano": {
          "cx": 76,
          "cy": 345,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 311 C424 320 435 339 426 353",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 311
        },
        "control1": {
          "x": 424,
          "y": 320
        },
        "control2": {
          "x": 435,
          "y": 339
        },
        "fin": {
          "x": 426,
          "y": 353
        },
        "mano": {
          "cx": 426,
          "cy": 353,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<rect x=\"112\" y=\"131\" width=\"289\" height=\"262\" rx=\"20\" fill=\"#BFC8D4\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"130\" y=\"151\" width=\"250\" height=\"224\" rx=\"15\" fill=\"#DCE2E6\" stroke=\"#22344A\" stroke-width=\"5\" /><circle cx=\"202\" cy=\"215\" r=\"49\" fill=\"#EFF2F0\" stroke=\"#22344A\" stroke-width=\"5\" /><circle cx=\"202\" cy=\"215\" r=\"32\" fill=\"#B8CAD4\" stroke=\"#22344A\" stroke-width=\"4\" /><circle cx=\"202\" cy=\"215\" r=\"10\" fill=\"#566C80\" stroke=\"#22344A\" stroke-width=\"4\" /><path d=\"M217 217 L288 180 L298 190 L233 232\" fill=\"none\" stroke=\"#55677D\" stroke-width=\"10\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><text x=\"171\" y=\"362\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">IDE</text><rect x=\"340\" y=\"177\" width=\"25\" height=\"23\" rx=\"3\" fill=\"#697E90\" stroke=\"#22344A\" stroke-width=\"3\" />",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<rect x=\"112\" y=\"131\" width=\"289\" height=\"262\" rx=\"20\" fill=\"#BFC8D4\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"130\" y=\"151\" width=\"250\" height=\"224\" rx=\"15\" fill=\"#DCE2E6\" stroke=\"#22344A\" stroke-width=\"5\" /><circle cx=\"202\" cy=\"215\" r=\"49\" fill=\"#EFF2F0\" stroke=\"#22344A\" stroke-width=\"5\" /><circle cx=\"202\" cy=\"215\" r=\"32\" fill=\"#B8CAD4\" stroke=\"#22344A\" stroke-width=\"4\" /><circle cx=\"202\" cy=\"215\" r=\"10\" fill=\"#566C80\" stroke=\"#22344A\" stroke-width=\"4\" /><path d=\"M217 217 L288 180 L298 190 L233 232\" fill=\"none\" stroke=\"#55677D\" stroke-width=\"10\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><text x=\"171\" y=\"362\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">IDE</text><rect x=\"340\" y=\"177\" width=\"25\" height=\"23\" rx=\"3\" fill=\"#697E90\" stroke=\"#22344A\" stroke-width=\"3\" />"
      }
    ],
    "partes": {},
    "rostro": {
      "transformacion": "",
      "desplazamiento": {
        "x": 0,
        "y": 0
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 246,
          "cy": 293,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 249,
          "cy": 297,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 252,
          "cy": 291,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 308,
          "cy": 293,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 311,
          "cy": 297,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 314,
          "cy": 291,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M231 253 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 231,
          "y": 253
        },
        "control": {
          "x": 244,
          "y": 244
        },
        "fin": {
          "x": 258,
          "y": 252
        }
      },
      {
        "d": "M296 253 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 296,
          "y": 253
        },
        "control": {
          "x": 308,
          "y": 245
        },
        "fin": {
          "x": 322,
          "y": 254
        }
      }
    ],
    "mejillas": [
      {
        "cx": 212,
        "cy": 324,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 342,
        "cy": 324,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M254 334 Q277 362 300 334",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 254,
        "y": 334
      },
      "control": {
        "x": 277,
        "y": 362
      },
      "fin": {
        "x": 300,
        "y": 334
      }
    },
    "hablando": {
      "boca": {
        "cx": 277,
        "cy": 341,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M267 351 Q277 342 286 351",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 267,
          "y": 351
        },
        "control": {
          "x": 277,
          "y": 342
        },
        "fin": {
          "x": 286,
          "y": 351
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 277,
        "cy": 342,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M232 254 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 232,
            "y": 254
          },
          "control": {
            "x": 244.5,
            "y": 250
          },
          "fin": {
            "x": 257,
            "y": 246
          }
        },
        {
          "d": "M298 246 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 298,
            "y": 246
          },
          "control": {
            "x": 310,
            "y": 250
          },
          "fin": {
            "x": 322,
            "y": 254
          }
        }
      ]
    }
  },
  "mebre": {
    "id": "mebre",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 311 C91 302 72 317 76 345",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 311
        },
        "control1": {
          "x": 91,
          "y": 302
        },
        "control2": {
          "x": 72,
          "y": 317
        },
        "fin": {
          "x": 76,
          "y": 345
        },
        "mano": {
          "cx": 76,
          "cy": 345,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 311 C424 320 435 339 426 353",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 311
        },
        "control1": {
          "x": 424,
          "y": 320
        },
        "control2": {
          "x": 435,
          "y": 339
        },
        "fin": {
          "x": 426,
          "y": 353
        },
        "mano": {
          "cx": 426,
          "cy": 353,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<rect x=\"118\" y=\"129\" width=\"281\" height=\"275\" rx=\"18\" fill=\"#F4DBB4\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"137\" y=\"149\" width=\"244\" height=\"235\" rx=\"12\" fill=\"#FFF2DF\" stroke=\"#22344A\" stroke-width=\"5\" /><text x=\"258\" y=\"182\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">MBR</text><rect x=\"156\" y=\"189\" width=\"203\" height=\"11\" rx=\"3\" fill=\"#88ABC3\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"157\" y=\"205\" width=\"44\" height=\"18\" rx=\"4\" fill=\"#B6D1BA\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"208\" y=\"205\" width=\"44\" height=\"18\" rx=\"4\" fill=\"#EFC68D\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"259\" y=\"205\" width=\"44\" height=\"18\" rx=\"4\" fill=\"#B9BBEA\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"310\" y=\"205\" width=\"44\" height=\"18\" rx=\"4\" fill=\"#EBA7A6\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"182\" y=\"359\" width=\"148\" height=\"21\" rx=\"7\" fill=\"#3B5065\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"257\" y=\"375.5\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"17\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#FFE3A2\">55 AA</text>",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<rect x=\"118\" y=\"129\" width=\"281\" height=\"275\" rx=\"18\" fill=\"#F4DBB4\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"137\" y=\"149\" width=\"244\" height=\"235\" rx=\"12\" fill=\"#FFF2DF\" stroke=\"#22344A\" stroke-width=\"5\" /><text x=\"258\" y=\"182\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">MBR</text><rect x=\"156\" y=\"189\" width=\"203\" height=\"11\" rx=\"3\" fill=\"#88ABC3\" stroke=\"#22344A\" stroke-width=\"3\" /><rect x=\"157\" y=\"205\" width=\"44\" height=\"18\" rx=\"4\" fill=\"#B6D1BA\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"208\" y=\"205\" width=\"44\" height=\"18\" rx=\"4\" fill=\"#EFC68D\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"259\" y=\"205\" width=\"44\" height=\"18\" rx=\"4\" fill=\"#B9BBEA\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"310\" y=\"205\" width=\"44\" height=\"18\" rx=\"4\" fill=\"#EBA7A6\" stroke=\"#22344A\" stroke-width=\"2\" /><rect x=\"182\" y=\"359\" width=\"148\" height=\"21\" rx=\"7\" fill=\"#3B5065\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"257\" y=\"375.5\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"17\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#FFE3A2\">55 AA</text>"
      }
    ],
    "partes": {},
    "rostro": {
      "transformacion": "translate(0 4)",
      "desplazamiento": {
        "x": 0,
        "y": 4
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 226,
          "cy": 275,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 229,
          "cy": 279,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 232,
          "cy": 273,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 288,
          "cy": 275,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 291,
          "cy": 279,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 294,
          "cy": 273,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M211 235 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 211,
          "y": 235
        },
        "control": {
          "x": 224,
          "y": 226
        },
        "fin": {
          "x": 238,
          "y": 234
        }
      },
      {
        "d": "M276 235 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 276,
          "y": 235
        },
        "control": {
          "x": 288,
          "y": 227
        },
        "fin": {
          "x": 302,
          "y": 236
        }
      }
    ],
    "mejillas": [
      {
        "cx": 192,
        "cy": 306,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 322,
        "cy": 306,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M234 316 Q257 344 280 316",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 234,
        "y": 316
      },
      "control": {
        "x": 257,
        "y": 344
      },
      "fin": {
        "x": 280,
        "y": 316
      }
    },
    "hablando": {
      "boca": {
        "cx": 257,
        "cy": 323,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M247 333 Q257 324 266 333",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 247,
          "y": 333
        },
        "control": {
          "x": 257,
          "y": 324
        },
        "fin": {
          "x": 266,
          "y": 333
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 257,
        "cy": 324,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M212 236 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 212,
            "y": 236
          },
          "control": {
            "x": 224.5,
            "y": 232
          },
          "fin": {
            "x": 237,
            "y": 228
          }
        },
        {
          "d": "M278 228 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 278,
            "y": 228
          },
          "control": {
            "x": 290,
            "y": 232
          },
          "fin": {
            "x": 302,
            "y": 236
          }
        }
      ]
    }
  },
  "grubi": {
    "id": "grubi",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 311 C91 302 72 317 76 345",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 311
        },
        "control1": {
          "x": 91,
          "y": 302
        },
        "control2": {
          "x": 72,
          "y": 317
        },
        "fin": {
          "x": 76,
          "y": 345
        },
        "mano": {
          "cx": 76,
          "cy": 345,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 311 C424 320 435 339 426 353",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 311
        },
        "control1": {
          "x": 424,
          "y": 320
        },
        "control2": {
          "x": 435,
          "y": 339
        },
        "fin": {
          "x": 426,
          "y": 353
        },
        "mano": {
          "cx": 426,
          "cy": 353,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<rect x=\"138\" y=\"127\" width=\"246\" height=\"275\" rx=\"23\" fill=\"#777CB8\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"154\" y=\"142\" width=\"214\" height=\"246\" rx=\"14\" fill=\"#A7ACDB\" stroke=\"#22344A\" stroke-width=\"5\" /><text x=\"256\" y=\"172\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#1F3353\">GRUB</text><rect x=\"153\" y=\"180\" width=\"64\" height=\"28\" rx=\"6\" fill=\"#D4E9D1\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"185\" y=\"200\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"16\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">1</text><rect x=\"223\" y=\"180\" width=\"64\" height=\"28\" rx=\"6\" fill=\"#FADEA6\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"255\" y=\"200\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"16\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">1.5</text><rect x=\"294\" y=\"180\" width=\"64\" height=\"28\" rx=\"6\" fill=\"#D4E9D1\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"326\" y=\"200\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"16\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">2</text><path d=\"M163 357 h187\" fill=\"none\" stroke=\"#5E689E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<rect x=\"138\" y=\"127\" width=\"246\" height=\"275\" rx=\"23\" fill=\"#777CB8\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"154\" y=\"142\" width=\"214\" height=\"246\" rx=\"14\" fill=\"#A7ACDB\" stroke=\"#22344A\" stroke-width=\"5\" /><text x=\"256\" y=\"172\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"26\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#1F3353\">GRUB</text><rect x=\"153\" y=\"180\" width=\"64\" height=\"28\" rx=\"6\" fill=\"#D4E9D1\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"185\" y=\"200\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"16\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">1</text><rect x=\"223\" y=\"180\" width=\"64\" height=\"28\" rx=\"6\" fill=\"#FADEA6\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"255\" y=\"200\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"16\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">1.5</text><rect x=\"294\" y=\"180\" width=\"64\" height=\"28\" rx=\"6\" fill=\"#D4E9D1\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"326\" y=\"200\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"16\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">2</text><path d=\"M163 357 h187\" fill=\"none\" stroke=\"#5E689E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />"
      }
    ],
    "partes": {},
    "rostro": {
      "transformacion": "",
      "desplazamiento": {
        "x": 0,
        "y": 0
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 226,
          "cy": 276,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 229,
          "cy": 280,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 232,
          "cy": 274,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 288,
          "cy": 276,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 291,
          "cy": 280,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 294,
          "cy": 274,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M211 236 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 211,
          "y": 236
        },
        "control": {
          "x": 224,
          "y": 227
        },
        "fin": {
          "x": 238,
          "y": 235
        }
      },
      {
        "d": "M276 236 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 276,
          "y": 236
        },
        "control": {
          "x": 288,
          "y": 228
        },
        "fin": {
          "x": 302,
          "y": 237
        }
      }
    ],
    "mejillas": [
      {
        "cx": 192,
        "cy": 307,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 322,
        "cy": 307,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M234 317 Q257 345 280 317",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 234,
        "y": 317
      },
      "control": {
        "x": 257,
        "y": 345
      },
      "fin": {
        "x": 280,
        "y": 317
      }
    },
    "hablando": {
      "boca": {
        "cx": 257,
        "cy": 324,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M247 334 Q257 325 266 334",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 247,
          "y": 334
        },
        "control": {
          "x": 257,
          "y": 325
        },
        "fin": {
          "x": 266,
          "y": 334
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 257,
        "cy": 325,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M212 237 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 212,
            "y": 237
          },
          "control": {
            "x": 224.5,
            "y": 233
          },
          "fin": {
            "x": 237,
            "y": 229
          }
        },
        {
          "d": "M278 229 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 278,
            "y": 229
          },
          "control": {
            "x": 290,
            "y": 233
          },
          "fin": {
            "x": 302,
            "y": 237
          }
        }
      ]
    }
  },
  "nucleo": {
    "id": "nucleo",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 311 C91 302 72 317 76 345",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 311
        },
        "control1": {
          "x": 91,
          "y": 302
        },
        "control2": {
          "x": 72,
          "y": 317
        },
        "fin": {
          "x": 76,
          "y": 345
        },
        "mano": {
          "cx": 76,
          "cy": 345,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 311 C424 320 435 339 426 353",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 311
        },
        "control1": {
          "x": 424,
          "y": 320
        },
        "control2": {
          "x": 435,
          "y": 339
        },
        "fin": {
          "x": 426,
          "y": 353
        },
        "mano": {
          "cx": 426,
          "cy": 353,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<polygon points=\"385.3,320.6 309.6,396.3 202.4,396.3 126.7,320.6 126.7,213.4 202.4,137.7 309.6,137.7 385.3,213.4\" fill=\"#73AFC9\" stroke=\"#22344A\" stroke-width=\"9\" stroke-linejoin=\"round\"/><circle cx=\"256\" cy=\"268\" r=\"109\" fill=\"#C3DDE7\" stroke=\"#22344A\" stroke-width=\"5\" /><text x=\"256\" y=\"215\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"23\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">KERNEL</text><path d=\"M373.0 268.0 L388.0 268.0\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M338.7 350.7 L349.3 361.3\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M256.0 385.0 L256.0 400.0\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M173.3 350.7 L162.7 361.3\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M139.0 268.0 L124.0 268.0\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M173.3 185.3 L162.7 174.7\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M256.0 151.0 L256.0 136.0\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M338.7 185.3 L349.3 174.7\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<polygon points=\"385.3,320.6 309.6,396.3 202.4,396.3 126.7,320.6 126.7,213.4 202.4,137.7 309.6,137.7 385.3,213.4\" fill=\"#73AFC9\" stroke=\"#22344A\" stroke-width=\"9\" stroke-linejoin=\"round\"/><circle cx=\"256\" cy=\"268\" r=\"109\" fill=\"#C3DDE7\" stroke=\"#22344A\" stroke-width=\"5\" /><text x=\"256\" y=\"215\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"23\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#20334A\">KERNEL</text><path d=\"M373.0 268.0 L388.0 268.0\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M338.7 350.7 L349.3 361.3\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M256.0 385.0 L256.0 400.0\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M173.3 350.7 L162.7 361.3\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M139.0 268.0 L124.0 268.0\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M173.3 185.3 L162.7 174.7\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M256.0 151.0 L256.0 136.0\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><path d=\"M338.7 185.3 L349.3 174.7\" fill=\"none\" stroke=\"#F7DF9E\" stroke-width=\"5\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />"
      }
    ],
    "partes": {},
    "rostro": {
      "transformacion": "",
      "desplazamiento": {
        "x": 0,
        "y": 0
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 225,
          "cy": 276,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 228,
          "cy": 280,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 231,
          "cy": 274,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 287,
          "cy": 276,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 290,
          "cy": 280,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 293,
          "cy": 274,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M210 236 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 210,
          "y": 236
        },
        "control": {
          "x": 223,
          "y": 227
        },
        "fin": {
          "x": 237,
          "y": 235
        }
      },
      {
        "d": "M275 236 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 275,
          "y": 236
        },
        "control": {
          "x": 287,
          "y": 228
        },
        "fin": {
          "x": 301,
          "y": 237
        }
      }
    ],
    "mejillas": [
      {
        "cx": 191,
        "cy": 307,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 321,
        "cy": 307,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M233 317 Q256 345 279 317",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 233,
        "y": 317
      },
      "control": {
        "x": 256,
        "y": 345
      },
      "fin": {
        "x": 279,
        "y": 317
      }
    },
    "hablando": {
      "boca": {
        "cx": 256,
        "cy": 324,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M246 334 Q256 325 265 334",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 246,
          "y": 334
        },
        "control": {
          "x": 256,
          "y": 325
        },
        "fin": {
          "x": 265,
          "y": 334
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 256,
        "cy": 325,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M211 237 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 211,
            "y": 237
          },
          "control": {
            "x": 223.5,
            "y": 233
          },
          "fin": {
            "x": 236,
            "y": 229
          }
        },
        {
          "d": "M277 229 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 277,
            "y": 229
          },
          "control": {
            "x": 289,
            "y": 233
          },
          "fin": {
            "x": 301,
            "y": 237
          }
        }
      ]
    }
  },
  "init": {
    "id": "init",
    "sombra": {
      "cx": 256,
      "cy": 464,
      "rx": 136,
      "ry": 18,
      "color": "#1B2F45",
      "opacidad": 0.14,
      "trazo": null
    },
    "piernas": [
      {
        "d": "M214 370 L208 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 214,
          "y": 370
        },
        "fin": {
          "x": 208,
          "y": 423
        }
      },
      {
        "d": "M303 372 L311 423",
        "color": "#22344A",
        "grosor": 23,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 303,
          "y": 372
        },
        "fin": {
          "x": 311,
          "y": 423
        }
      }
    ],
    "pies": [
      {
        "cx": 199,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      },
      {
        "cx": 322,
        "cy": 435,
        "rx": 31,
        "ry": 18,
        "color": "#E8AD69",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 6,
          "remate": "butt",
          "union": "miter"
        }
      }
    ],
    "brazos": [
      {
        "d": "M139 311 C91 302 72 317 76 345",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 139,
          "y": 311
        },
        "control1": {
          "x": 91,
          "y": 302
        },
        "control2": {
          "x": 72,
          "y": 317
        },
        "fin": {
          "x": 76,
          "y": 345
        },
        "mano": {
          "cx": 76,
          "cy": 345,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      },
      {
        "d": "M376 311 C424 320 435 339 426 353",
        "color": "#22344A",
        "grosor": 20,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 376,
          "y": 311
        },
        "control1": {
          "x": 424,
          "y": 320
        },
        "control2": {
          "x": 435,
          "y": 339
        },
        "fin": {
          "x": 426,
          "y": 353
        },
        "mano": {
          "cx": 426,
          "cy": 353,
          "r": 17,
          "color": "#FFF8EF",
          "trazo": {
            "color": "#22344A",
            "grosor": 6,
            "remate": "butt",
            "union": "miter"
          }
        }
      }
    ],
    "cuerpo": "<rect x=\"138\" y=\"137\" width=\"241\" height=\"266\" rx=\"20\" fill=\"#9AC795\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"155\" y=\"154\" width=\"207\" height=\"229\" rx=\"12\" fill=\"#E5F3DF\" stroke=\"#22344A\" stroke-width=\"5\" /><rect x=\"155\" y=\"154\" width=\"207\" height=\"52\" rx=\"12\" fill=\"#51795E\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"256\" y=\"189\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"28\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#FFFFFF\">PID 1</text><path d=\"M168 222 l12 8 -12 8 M186 238 h12\" fill=\"none\" stroke=\"#719C80\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><circle cx=\"339\" cy=\"368\" r=\"8\" fill=\"#78B28A\" stroke=\"#22344A\" stroke-width=\"3\" />",
    "capasCuerpo": [
      {
        "tipo": "estatico",
        "markup": "<rect x=\"138\" y=\"137\" width=\"241\" height=\"266\" rx=\"20\" fill=\"#9AC795\" stroke=\"#22344A\" stroke-width=\"8\" /><rect x=\"155\" y=\"154\" width=\"207\" height=\"229\" rx=\"12\" fill=\"#E5F3DF\" stroke=\"#22344A\" stroke-width=\"5\" /><rect x=\"155\" y=\"154\" width=\"207\" height=\"52\" rx=\"12\" fill=\"#51795E\" stroke=\"#22344A\" stroke-width=\"3\" /><text x=\"256\" y=\"189\" text-anchor=\"middle\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"28\" font-weight=\"900\" letter-spacing=\"2\" fill=\"#FFFFFF\">PID 1</text><path d=\"M168 222 l12 8 -12 8 M186 238 h12\" fill=\"none\" stroke=\"#719C80\" stroke-width=\"6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" /><circle cx=\"339\" cy=\"368\" r=\"8\" fill=\"#78B28A\" stroke=\"#22344A\" stroke-width=\"3\" />"
      }
    ],
    "partes": {},
    "rostro": {
      "transformacion": "",
      "desplazamiento": {
        "x": 0,
        "y": 0
      }
    },
    "ojos": [
      {
        "blanco": {
          "cx": 224,
          "cy": 279,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 227,
          "cy": 283,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 230,
          "cy": 277,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      },
      {
        "blanco": {
          "cx": 286,
          "cy": 279,
          "rx": 19,
          "ry": 24,
          "color": "#FFFFFF",
          "opacidad": 1,
          "trazo": {
            "color": "#22344A",
            "grosor": 5,
            "remate": "butt",
            "union": "miter"
          }
        },
        "pupila": {
          "cx": 289,
          "cy": 283,
          "rx": 8.2,
          "ry": 11,
          "color": "#273A56",
          "opacidad": 1,
          "trazo": null
        },
        "brillo": {
          "cx": 292,
          "cy": 277,
          "r": 3.5,
          "color": "#FFFFFF",
          "trazo": null
        }
      }
    ],
    "cejas": [
      {
        "d": "M209 239 q13 -9 27 -1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 209,
          "y": 239
        },
        "control": {
          "x": 222,
          "y": 230
        },
        "fin": {
          "x": 236,
          "y": 238
        }
      },
      {
        "d": "M274 239 q12 -8 26 1",
        "color": "#22344A",
        "grosor": 5,
        "remate": "round",
        "union": "round",
        "inicio": {
          "x": 274,
          "y": 239
        },
        "control": {
          "x": 286,
          "y": 231
        },
        "fin": {
          "x": 300,
          "y": 240
        }
      }
    ],
    "mejillas": [
      {
        "cx": 190,
        "cy": 310,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      },
      {
        "cx": 320,
        "cy": 310,
        "rx": 14,
        "ry": 8,
        "color": "#F29D92",
        "opacidad": 0.25,
        "trazo": null
      }
    ],
    "boca": {
      "d": "M232 320 Q255 348 278 320",
      "color": "#22344A",
      "grosor": 6,
      "remate": "round",
      "union": "round",
      "inicio": {
        "x": 232,
        "y": 320
      },
      "control": {
        "x": 255,
        "y": 348
      },
      "fin": {
        "x": 278,
        "y": 320
      }
    },
    "hablando": {
      "boca": {
        "cx": 255,
        "cy": 327,
        "rx": 19,
        "ry": 22,
        "color": "#70384C",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "lengua": {
        "d": "M245 337 Q255 328 264 337",
        "color": "#F2A2A4",
        "grosor": 5,
        "remate": "butt",
        "union": "miter",
        "inicio": {
          "x": 245,
          "y": 337
        },
        "control": {
          "x": 255,
          "y": 328
        },
        "fin": {
          "x": 264,
          "y": 337
        }
      }
    },
    "alerta": {
      "boca": {
        "cx": 255,
        "cy": 328,
        "rx": 13,
        "ry": 16,
        "color": "#FFFFFF",
        "opacidad": 1,
        "trazo": {
          "color": "#22344A",
          "grosor": 5,
          "remate": "butt",
          "union": "miter"
        }
      },
      "cejas": [
        {
          "d": "M210 240 l25 -8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 210,
            "y": 240
          },
          "control": {
            "x": 222.5,
            "y": 236
          },
          "fin": {
            "x": 235,
            "y": 232
          }
        },
        {
          "d": "M276 232 l24 8",
          "color": "#22344A",
          "grosor": 5,
          "remate": "round",
          "union": "round",
          "inicio": {
            "x": 276,
            "y": 232
          },
          "control": {
            "x": 288,
            "y": 236
          },
          "fin": {
            "x": 300,
            "y": 240
          }
        }
      ]
    }
  }
};
