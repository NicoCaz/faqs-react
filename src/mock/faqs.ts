import type { Node, Edge } from "reactflow";
import { MarkerType } from "reactflow";

interface FAQNodeData {
  type: "N1" | "N2" | "N3" | "N4";
  title: string;
  url?: string;
  onUpdate: (id: string, data: Partial<FAQNodeData>) => void;
  onDelete: (id: string) => void;
}

// Función temporal para los datos iniciales
const tempUpdate = (id: string, data: Partial<FAQNodeData>) => {};
const tempDelete = (id: string) => {};

export const faqs: Node[] = [
  {
    id: "6363c0db9204ee669da68777",
    type: "card",
    position: { x: 0, y: 0 },
    data: {
      title: "Cobros",
      icon: "handCash",
      description: "Cobranza, proveedores, pago directo",
      url: "cobros",
      to: "/n2/cobros",
      type: 0,
      level: 1,
      status: 1,
      order: 7,
      displayConfig: {
        isEnabledOnNonBusinessDay: true,
        enabledOnChannels: ["ispublic", "officebanking"],
      },
      children: [
        {
          id: "6363fba09204ee669da68778",
          type: "card",
          position: { x: 200, y: 0 },
          data: {
            title: "Pago Directo",
            url: "pago-directo",
            to: "/n3/pago-directo",
            type: 0,
            level: 2,
            status: 1,
            order: 1000,
            parent: "6363c0db9204ee669da68777",
            displayConfig: {
              isEnabledOnNonBusinessDay: true,
              enabledOnChannels: ["ispublic", "officebanking"],
            },
            children: [
              {
                id: "6723c46e832f86e945c030f4",
                type: "card",
                position: { x: 400, y: 0 },
                data: {
                  title: "¿Qué es Pago Directo?",
                  url: "que-es-pago-directo",
                  to: "/n4/que-es-pago-directo",
                  subtitle: {
                    text: "Información general",
                  },
                  type: 0,
                  level: 3,
                  status: 1,
                  order: 16000,
                  parent: "6363fba09204ee669da68778",
                  content: "67267bce832f86e945c03399",
                  displayConfig: {
                    isEnabledOnNonBusinessDay: true,
                    enabledOnChannels: ["ispublic"],
                  },
                  children: [
                    {
                      id: "67267bce832f86e945c03399",
                      type: "card",
                      position: { x: 600, y: 0 },
                      data: {
                        title: "¿Qué es Pago Directo?",
                        url: "/n4/que-es-pago-directo",
                        type: 0,
                        level: 4,
                        status: 1,
                        order: 0,
                        parent: "6723c46e832f86e945c030f4",
                        guruId: "0a17c7d0-97f7-4ebd-9a44-f7ed5604df9e",
                        htmlContent:
                          '<p class="ghq-card-content__paragraph" data-ghq-card-content-type="paragraph">Permite a una empresa cobrar sus facturas <strong class="ghq-card-content__bold" data-ghq-card-content-type="BOLD">por débito automático</strong> en las cuentas de sus clientes, siempre y cuando estén asociadas a COELSA.</p><p class="ghq-card-content__paragraph ghq-is-empty" data-ghq-card-content-type="paragraph"><a class="ghq-card-content__link" data-ghq-card-content-type="LINK" href="http:///n4/como-doy-de-alta-pago-directo" target="_blank" rel="noopener noreferrer"><strong class="ghq-card-content__bold" data-ghq-card-content-type="BOLD"><span class="ghq-card-content__text-color" data-ghq-card-content-type="TEXT_COLOR" style="color:#ff8a60">Conocé cómo darte de alta.</span></strong></a></p><p class="ghq-card-content__paragraph ghq-is-empty" data-ghq-card-content-type="paragraph"></p>',
                        digitalType: "Cobros y pagos",
                        digitalSubType: "Pago directo",
                        tags: [],
                        htmlTabContent: [],
                        multimedia: [],
                        htmlStepContent: [],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    id: "63a0ae9d9cd75fa2bab6141f",
    type: "card",
    position: { x: 0, y: 100 },
    data: {
      title: "Cuentas",
      icon: "docCheck",
      description: "Agenda de contactos, extractos, CBU",
      url: "cuentas",
      to: "/n2/cuentas",
      type: 0,
      level: 1,
      status: 1,
      order: 4,
      displayConfig: {
        isEnabledOnNonBusinessDay: true,
        enabledOnChannels: ["reduced", "ispublic", "officebanking"],
      },
      children: [
        {
          id: "63a0b3109cd75fa2bab61420",
          type: "card",
          position: { x: 200, y: 100 },
          data: {
            title: "Extractos y movimientos",
            url: "extractos-y-movimientos",
            to: "/n3/extractos-y-movimientos",
            subtitle: {
              text: "Extractos y operaciones",
            },
            type: 0,
            level: 2,
            status: 1,
            order: 5,
            parent: "63a0ae9d9cd75fa2bab6141f",
            displayConfig: {
              isEnabledOnNonBusinessDay: true,
              enabledOnChannels: ["reduced", "ispublic", "officebanking"],
            },
          },
        },
      ],
    },
  },
];
