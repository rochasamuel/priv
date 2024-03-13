import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Loader2, Mail } from "lucide-react";
import useBackendClient from "@/hooks/useBackendClient";
import { useMutation } from "react-query";
import { useState } from "react";
import { toast } from "../ui/use-toast";

interface PasswordRecoverDialogProps {
  closePasswordRecoverDialog: () => void;
}

const passwordRecoverySchema = z.object({
  email: z
    .string({ required_error: "Campo obrigatório" })
    .email({ message: "O email informado não é válido" }),
});

export default function PasswordRecoverDialog({
  closePasswordRecoverDialog,
}: PasswordRecoverDialogProps) {
  const { api } = useBackendClient();
  const [sucessfullyRequested, setSucessfullyRequested] = useState(false);

  const { mutate: requestPasswordRecovery, isLoading } = useMutation({
    mutationFn: async (email: string) => {
      return api.auth.requestPasswordRecovery(email);
    },
    onSuccess: () => {
      setSucessfullyRequested(true);
    },
    onError(error: any, variables, context) {
      toast({
        variant: "destructive",
        title: "Erro ao solicitar recuperação de senha",
        description:
          error.response.data.message ??
          "Ouve um problema ao enviar seu email de confirmação. Tente novamente mais tarde",
      });
    },
  });

  const passwordRecoveryForm = useForm<z.infer<typeof passwordRecoverySchema>>({
    mode: "onChange",
    resolver: zodResolver(passwordRecoverySchema),
  });

  async function onSubmitPasswordRecovery(
    values: z.infer<typeof passwordRecoverySchema>
  ) {
    requestPasswordRecovery(values.email);
  }

  return (
    <Dialog defaultOpen onOpenChange={closePasswordRecoverDialog}>
      <DialogContent className="max-w-[95vw] md:max-w-[40dvw]">
        <DialogHeader>
          <DialogTitle>Recuperar senha</DialogTitle>
        </DialogHeader>
        {!sucessfullyRequested ? (
          <>
            <p className="text-sm">
              Digite seu email para receber um link de recuperação de senha:
            </p>
            <div className="h-full">
              <Form {...passwordRecoveryForm}>
                <form
                  onSubmit={passwordRecoveryForm.handleSubmit(
                    onSubmitPasswordRecovery
                  )}
                >
                  <FormField
                    control={passwordRecoveryForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="text"
                            placeholder="Seu email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="mt-6 flex flex-col-reverse gap-4 md:flex-row md:gap-2 md:justify-end">
                    <Button
                      variant={"outline"}
                      disabled={isLoading}
                      onClick={closePasswordRecoverDialog}
                    >
                      Cancelar
                    </Button>
                    <Button disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Aguarde
                        </>
                      ) : (
                        <>
                          Enviar
                          <Mail className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm">
              Um link de recuperação de senha foi enviado para o email
              informado.
            </p>
            <div className="w-full flex justify-end">
              <Button
                className="w-full md:w-52"
                onClick={closePasswordRecoverDialog}
              >
                Fechar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
