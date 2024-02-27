"use client";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

// export const metadata: Metadata = {
//   title: "Política de Privacidade",
// };

export default function Help() {
  const [selectedSection, setSelectedSection] = useState("about");

  const handleSessionChange = (
    session:
      | "about"
      | "payments"
      | "subscriptions"
      | "config"
      | "profile"
      | "affiliates"
  ) => {
    setSelectedSection(session);
  };

  const renderSession = () => {
    switch (selectedSection) {
      case "about":
        return <About />;
      case "payments":
        return <Payments />;
      case "subscriptions":
        return <Subscriptions />;
      case "config":
        return <Config />;
      case "profile":
        return <Profile />;
      case "affiliates":
        return <Affilitiates />;
    }
  };

  const selectedSessionStyle =
    "text-lg font-bold border-b-2 border-pink-500 transition-all duration-500";

  return (
    <div className="p-6">
      <div className="w-full h-max bg-background z-20 mb-4 flex gap-4 items-center justify-start py-2 overflow-x-auto">
        <div
          className={`cursor-pointer min-w-max text-lg  ${
            selectedSection === "about" && selectedSessionStyle
          }`}
          onClick={() => handleSessionChange("about")}
        >
          Sobre a plataforma
        </div>
        <Separator orientation="vertical" />
        <div
          className={`cursor-pointer min-w-max text-lg  ${
            selectedSection === "payments" && selectedSessionStyle
          }`}
          onClick={() => handleSessionChange("payments")}
        >
          Pagamentos
        </div>
        <Separator orientation="vertical" />
        <div
          className={`cursor-pointer min-w-max text-lg  ${
            selectedSection === "subscriptions" && selectedSessionStyle
          }`}
          onClick={() => handleSessionChange("subscriptions")}
        >
          Assinaturas
        </div>
        <Separator orientation="vertical" />
        <div
          className={`cursor-pointer min-w-max text-lg  ${
            selectedSection === "config" && selectedSessionStyle
          }`}
          onClick={() => handleSessionChange("config")}
        >
          Conta e configurações
        </div>
        <Separator orientation="vertical" />
        <div
          className={`cursor-pointer min-w-max text-lg  ${
            selectedSection === "profile" && selectedSessionStyle
          }`}
          onClick={() => handleSessionChange("profile")}
        >
          Perfil e posts
        </div>
        <Separator orientation="vertical" />
        <div
          className={`cursor-pointer min-w-max text-lg ${
            selectedSection === "affiliates" && selectedSessionStyle
          }`}
          onClick={() => handleSessionChange("affiliates")}
        >
          Afiliados
        </div>
      </div>

      {renderSession()}
    </div>
  );
}

function About() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-xl text-left">
          O que é a Privatus?
        </AccordionTrigger>
        <AccordionContent>
          O serviço prestado pela Privatus consiste em uma rede social de
          compartilhamento de conteúdo no modelo de assinatura, em que os
          usuários do serviço devem pagar para acessar publicações exclusivas e
          os produtores podem compartilhar e vender seus conteúdos por meio da
          plataforma.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="text-xl text-left">
          Como me tornar criador de conteúdo?
        </AccordionTrigger>
        <AccordionContent>
          Para se tornar um criador de conteúdo na Privatus é necessário acessar{" "}
          {"Configurações > Cadastro de produtor"} ou pelo link{" "}
          <Link
            className="underline text-secondary"
            href="https://d384rvovcanpvp.cloudfront.net/settings/register-producer/"
          >
            https://d384rvovcanpvp.cloudfront.net/settings/register-producer/
          </Link>{" "}
          e preencher todos os seus dados pessoais, dados bancários, selfie e
          RG/CNH. Os documentos são necessários para validar a sua identidade.
          Após o envio dos documentos, o seu pedido será analisado e respondido
          em até 5 dias úteis.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger className="text-xl text-left">
          Como posso entrar em contato com os responsáveis da plataforma?
        </AccordionTrigger>
        <AccordionContent>
          A Privatus possibilita ao usuário atendimento facilitado, mantendo o
          serviço de atendimento via e-mail e WhatsApp para auxiliar os usuários
          com as suas dúvidas e problemas.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger className="text-xl text-left">
          Como excluir sua conta na Privatus?
        </AccordionTrigger>
        <AccordionContent>
          Você pode excluir a sua conta clicando na seta ao lado da sua foto na
          barra do menu superior e ir em {"Configurações > Desativar conta"} ou
          pelo link{" "}
          <Link
            className="underline text-secondary"
            href="https://d384rvovcanpvp.cloudfront.net/settings/account-deactivation/"
          >
            https://d384rvovcanpvp.cloudfront.net/settings/account-deactivation/
          </Link>
          .
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function Payments() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-5">
        <AccordionTrigger className="text-xl text-left">
          Quanto eu posso cobrar em uma assinatura?
        </AccordionTrigger>
        <AccordionContent>
          Você pode cobrar um valor mínimo de R$ 19,90 por mês na sua
          assinatura.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-6">
        <AccordionTrigger className="text-xl text-left">
          Qual é a taxa de pagamento da Privatus?
        </AccordionTrigger>
        <AccordionContent>
          A Privatus fica com uma taxa de 20%, e os criadores de conteúdo ficam
          com 80% do faturamento.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-7">
        <AccordionTrigger className="text-xl text-left">
          Como funciona para fazer o saque?
        </AccordionTrigger>
        <AccordionContent>
          O produtor pode fazer o requerimento do saque, disponível em{" "}
          {"Dashboard > Saque"} ou pelo link{" "}
          <Link
            className="underline text-secondary"
            href="https://d384rvovcanpvp.cloudfront.net/dashboard/"
          >
            https://d384rvovcanpvp.cloudfront.net/dashboard/
          </Link>
          . O dinheiro é transferido para a conta do produtor em até 3 dias
          úteis. O saldo fica bloqueado por períodos diferentes:
          <ul>
            <li>Pix: 3 dias</li>
            <li>Boleto: 3 dias</li>
            <li>Cartão de Crédito: 15 dias</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-8">
        <AccordionTrigger className="text-xl text-left">
          Quantos saques podem ser realizados por mês?
        </AccordionTrigger>
        <AccordionContent>
          Você pode realizar quantos saques quiser, mas apenas o primeiro é
          gratuito; os demais serão cobrados R$ 2,50 cada.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function Subscriptions() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-9">
        <AccordionTrigger className="text-xl text-left">
          Como faço para assinar perfis de produtores?
        </AccordionTrigger>
        <AccordionContent>
          Você só precisa acessar o perfil do produtor, escolher o plano de
          assinatura que preferir e realizar o pagamento via boleto, cartão de
          crédito ou PIX.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-10">
        <AccordionTrigger className="text-xl text-left">
          Qual tipo de conteúdo tenho acesso com a assinatura?
        </AccordionTrigger>
        <AccordionContent>
          O produtor posta conteúdos exclusivos, podendo ser no formato de
          texto, áudio, vídeo e imagem, os quais você terá acesso através da
          Privatus.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-11">
        <AccordionTrigger className="text-xl text-left">
          Quais são as formas de pagamento?
        </AccordionTrigger>
        <AccordionContent>
          A Privatus aceita pagamentos por boleto bancário, cartão de crédito ou
          PIX.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-12">
        <AccordionTrigger className="text-xl text-left">
          Quais cartões de crédito são válidos?
        </AccordionTrigger>
        <AccordionContent>
          Os cartões que podem ser utilizados na plataforma são: Visa,
          MasterCard, Elo, AMEX (American Express), Discover e Hipercard.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-13">
        <AccordionTrigger className="text-xl text-left">
          Como funciona a renovação da assinatura? E o cancelamento?
        </AccordionTrigger>
        <AccordionContent>
          As renovações ocorrem de forma automática de acordo com o plano
          assinado, podendo ser Mensal, Trimestral, Semestral ou Anual. Para
          cancelar a renovação, o usuário deve acessar o link{" "}
          <Link
            className="underline text-secondary"
            href="https://d384rvovcanpvp.cloudfront.net/subscriptions/"
          >
            https://d384rvovcanpvp.cloudfront.net/subscriptions/
          </Link>{" "}
          e procurar pelo criador de conteúdo desejado. Após cancelar uma
          assinatura, você não será cobrado na próxima renovação.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-14">
        <AccordionTrigger className="text-xl text-left">
          Após realizar o pagamento, quanto tempo depois tenho acesso ao
          conteúdo?
        </AccordionTrigger>
        <AccordionContent>
          Após a confirmação do seu pagamento pela instituição financeira. O
          prazo de confirmação do pagamento se dará da seguinte forma:
          <ul>
            <li>Boleto: até 2 dias úteis após o pagamento</li>
            <li>PIX: até 3 horas após o pagamento</li>
            <li>Cartão de Crédito: até 2 horas após o pagamento</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function Config() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-15">
        <AccordionTrigger className="text-xl text-left">
          Esqueci minha senha, o que posso fazer?
        </AccordionTrigger>
        <AccordionContent>
          Confirme que a senha que você digitou é a sua senha, sendo que as
          senhas diferenciam maiúsculas de minúsculas. Se ainda não der certo,
          você pode clicar em {"Esqueceu a senha?"}, digitar o seu endereço de
          e-mail e você receberá um e-mail com um link de recuperação de senha.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-16">
        <AccordionTrigger className="text-xl text-left">
          Minha conta pode ser suspensa? Por que?
        </AccordionTrigger>
        <AccordionContent>
          Todos os usuários que se cadastram na Privatus concordam com os Termos
          de Uso, que podem ser acessados pelo link{" "}
          <Link
            className="underline text-secondary"
            href="https://d384rvovcanpvp.cloudfront.net/terms/"
          >
            https://d384rvovcanpvp.cloudfront.net/terms/
          </Link>
          . O descumprimento dos termos levará à suspensão da conta.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function Profile() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-17">
        <AccordionTrigger className="text-xl text-left">
          Como alterar o meu nome de usuário?
        </AccordionTrigger>
        <AccordionContent>
          A alteração do nome de usuário pode ser feita acessando{" "}
          {"Configurações > Informações da conta"} ou pelo link{" "}
          <Link
            className="underline text-secondary"
            href="https://d384rvovcanpvp.cloudfront.net/settings/account-info/"
          >
            https://d384rvovcanpvp.cloudfront.net/settings/account-info/
          </Link>
          .
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-18">
        <AccordionTrigger className="text-xl text-left">
          Como eu consigo mudar a foto do meu perfil?
        </AccordionTrigger>
        <AccordionContent>
          Você pode mudar sua foto de perfil entrando em{" "}
          {"Configurações > Informações da conta"} ou pelo link{" "}
          <Link
            className="underline text-secondary"
            href="https://d384rvovcanpvp.cloudfront.net/settings/account-info/"
          >
            https://d384rvovcanpvp.cloudfront.net/settings/account-info/
          </Link>
          . Escolha um arquivo para sua foto. O upload pode demorar um pouco e,
          em seguida, você terá a opção de cortar e salvar sua nova foto de
          perfil. Pode levar algum tempo para alterar na plataforma, então não
          se preocupe se não mudar imediatamente. Se ainda não aparecer depois
          de uma hora ou mais, tente limpar os cookies e o cache do seu
          navegador. Obs: Não se esqueça que sua foto de perfil é pública, e
          você pode postar o que quiser, desde que tenha certeza de que sua nova
          foto de perfil não viole os Termos de Uso acessíveis pelo link{" "}
          <Link className="underline text-secondary" href="URL">
            URL
          </Link>
          .
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-19">
        <AccordionTrigger className="text-xl text-left">
          Como faço upload de uma foto?
        </AccordionTrigger>
        <AccordionContent>
          Se estiver utilizando a plataforma pelo computador: Clique no ícone da
          câmera abaixo do campo de publicação na home (página inicial), e
          selecione sua foto ou arraste e solte a(s) foto(s) dentro do campo de
          publicação. Depois que sua foto for carregada, clique no botão roxo{" "}
          {"Publicar"} e pronto! Se estiver utilizando a plataforma pelo
          celular: Clique no ícone de câmera abaixo do campo de publicação na
          home (página inicial), e selecione sua foto. Depois que sua foto for
          carregada, clique no botão roxo {"Publicar"} e pronto! Tamanho máximo
          da foto: 30 MB.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-20">
        <AccordionTrigger className="text-xl text-left">
          Como faço para editar uma publicação?
        </AccordionTrigger>
        <AccordionContent>
          Para editar uma publicação, clique em {"°°°"} ao lado da publicação no
          feed e escolha Editar. A partir daqui, você pode alterar o título, a
          descrição e a privacidade da publicação.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-21">
        <AccordionTrigger className="text-xl text-left">
          Como faço para excluir uma publicação?
        </AccordionTrigger>
        <AccordionContent>
          Para excluir uma publicação, clique no ícone {"°°°"} ao lado da
          publicação no feed e escolha Excluir a publicação. Então é só
          confirmar e sua publicação será excluída.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
function Affilitiates() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-22">
        <AccordionTrigger className="text-xl text-left">
          Como funciona o programa de afiliados?
        </AccordionTrigger>
        <AccordionContent>
          <ul className="list-decimal list-inside">
            <li>Você gera o link de afiliado;</li>
            <li>Compartilha com criadores de conteúdo;</li>
            <li>
              O criador de conteúdo se cadastra na plataforma e toda venda que
              ele realizar, durante 6 meses, você fica com 5% do valor bruto;
            </li>
            <li>
              O crédito aparece para você em Dashboard após 30 dias da venda
              realizada pelo criador de conteúdo;
            </li>
            <li>O valor mínimo para saque é R$10,00.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
