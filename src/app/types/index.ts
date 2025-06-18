// Interface do Evento atualizada com todos os campos necessários
export interface Event {
  id: string;
  title: string;
  address: string;
  imagem_do_evento: string;
  nome_do_evento: string;
  casa_do_evento: string;
  local_do_evento: string;
  data_do_evento: string;
  tipo_evento: string;
  dia_da_semana: number;
  hora_do_evento: string;
  preco?: number;
  place: {
    name: string;
    logo: string;
  };
}