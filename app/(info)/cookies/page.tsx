import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Cookies",
};

export default function Cookies() {
  return (
    <div className="w-full flex flex-col gap-8 p-6">
      <div className="text-2xl font-bold mx-auto">Política de Cookies</div>

      <div>
        Nesta política usamos o termo “cookies” para nos referirmos aos cookies
        e outras tecnologias similares.
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">O que é um cookie?</div>
        <div>
          Os cookies são pequenos arquivos criados por sites visitados e que são
          salvos no computador do usuário, por meio do navegador. Esses arquivos
          contêm informações que servem para identificar o visitante, seja para
          personalizar a página de acordo com o perfil ou para facilitar o
          transporte de dados entre as páginas de um mesmo site.
        </div>
        <div>
          A maioria dos navegadores da Internet aceita cookies automaticamente;
          entretanto, os usuários podem configurar seus navegadores para recusar
          certos tipos de cookies ou cookies específicos. Além disso, os
          usuários podem apagar os cookies a qualquer momento.
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">
          Nós usamos Cookies, quando relevante, para os seguintes efeitos:
        </div>
        <ul className="list-disc list-inside ml-4">
          <li>Para permitir o funcionamento adequado do nosso website;</li>
          <li>A visualização adequada do conteúdo;</li>
          <li>Criação e para relembrar do seu registro;</li>
          <li>Personalização de interface;</li>
          <li>
            Parâmetros associados ao seu equipamento incluindo a resolução do
            seu ecrã, etc;
          </li>
          <li>
            Melhoria do nosso website, por exemplo, testando ideias novas;
          </li>
          <li>
            Para garantir que o website está protegido e seguro e para
            protegê-lo contra fraude ou uso indevido do nosso website;
          </li>
          <li>Funcionalidade de sistemas estatísticos:</li>
          <li>Para evitar que os visitantes sejam registrados duas vezes;</li>
          <li>
            Para conhecer as reações dos utilizadores às nossas campanhas
            publicitárias;
          </li>
          <li>Para melhorar as nossas ofertas;</li>
          <li>Para saber como descobriu o nosso website.</li>
          <li>Para te oferecer suporte;</li>
          <li>
            Se não fornecer os dados isso pode afetar a nossa capacidade para
            fornecer os produtos e serviços.
          </li>
        </ul>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">
          O direito a desativar os Cookies.
        </div>
        <div>
          As configurações dos motores de busca da Internet estão normalmente
          programadas para aceitar Cookies, mas você pode facilmente ajustá-las
          pela alteração das configurações do seu motor de busca.
        </div>
        <div>
          Muitos cookies são usados para melhorar a utilização e funcionalidade
          dos websites / apps; portanto a desativação dos cookies pode impedi-lo
          de utilizar certas partes do nosso website.
        </div>
        <div>
          Se deseja restringir ou bloquear todos os cookies que estão
          configurados pelo nosso website (que podem impedi-lo de utilizar
          certas partes do site), ou quaisquer outros websites/apps, pode
          fazê-lo através das configurações do seu motor de busca. A função de
          ajuda no seu motor de busca deve dizer-lhe como fazê-lo. No entanto,
          seguem alguns exemplos:
        </div>

        <ul className="list-disc list-inside ml-4">
          <li>
            <Link
              className="underline text-secondary"
              target="_blank"
              href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&oco=1&hl=pt-BR"
            >
              Google Chrome
            </Link>
          </li>
          <li>
            <Link
              className="underline text-secondary"
              target="_blank"
              href="https://support.mozilla.org/pt-BR/kb/gerencie-configuracoes-de-armazenamento-local-de-s"
            >
              Mozilla Firefox
            </Link>
          </li>
          <li>
            <Link
              className="underline text-secondary"
              target="_blank"
              href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac"
            >
              Safari
            </Link>
          </li>
          <li>
            <Link
              className="underline text-secondary"
              target="_blank"
              href="https://support.microsoft.com/pt-br/help/17442/windows-internet-explorer-delete-manage-cookies"
            >
              Internet Explore
            </Link>
          </li>
          <li>
            <Link
              className="underline text-secondary"
              target="_blank"
              href="https://support.microsoft.com/pt-br/help/4027947/microsoft-edge-delete-cookies"
            >
              Microsoft Edge
            </Link>
          </li>
          <li>
            <Link
              className="underline text-secondary"
              target="_blank"
              href="https://help.opera.com/en/latest/web-preferences/#cookies"
            >
              Opera
            </Link>
          </li>
        </ul>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">Contatos</div>
        <div>
          Possui alguma dúvida a respeito de dados pessoais ou quer exercer
          algum direito? Entre em contato:{" "}
          <Link
            className="underline text-secondary"
            href="mailto:contato@privatus.vip"
          >
            contato@privatus.vip
          </Link>
        </div>
      </div>
    </div>
  );
}
