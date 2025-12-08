// Exporta um objeto contendo todos os componentes MDX personalizados
// Necessário para evitar que seja obrigatório importar os componentes em todo arquivo markdown

import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import Video from '@site/src/components/Video';
import { TopicCard, TopicGrid } from '@site/src/components/TopicMenu';

export default {
  ...MDXComponents, // mantém os componentes MDX originais
  Video,            // componente de vídeo do YouTube
  TopicCard,        // componente de card de tópico
  TopicGrid,        // componente de grid de tópicos
};