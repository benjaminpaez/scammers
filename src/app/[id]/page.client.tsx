"use client"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import demo from "@/assets/demo2.png"
import { useState } from "react";
import { load } from "exifreader"
 
export default function IdPageClient(
    { save }: { save: (
                        formData: FormData, 
                        location: {latitude: number; longitude: number}, 
                        exif: Record<string, unknown>
                    ) => Promise<void> }
) {
    const [preview, setPreview] = useState<File>()
    const [location, setLocation] = useState<{latitude: number; longitude: number}>()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget)
        const file = formData.get("image") as File
        const exif = await load(file)

        await save(formData, location!, exif)
    }
  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <Label className="grid gap-2">
        <span>Monto a transferir</span>
        <Input
          placeholder="3000"
          min={0}
          max={40000}
          name="amount"
          type="number"
          required
        />
      </Label>
      <Label className="grid gap-2">
        <span>CVU / CBU / alias</span>
        <Input 
          placeholder="surca.manto.titla" 
          name="destination" 
          type="text" 
          required
        />
      </Label>
      <Label className="grid gap-2">
        <span className="mb-2">Imagen</span>
        <div className="flex gap-3">
          <Image 
            src={demo} 
            alt="demo"
            className="aspect-square rounded object-contain bg-gray-100" 
            width={170} 
            height={170}
          />
          <div className="relative">
                {Boolean(preview) ? (
                    <Image 
                        src={URL.createObjectURL(preview!)} 
                        alt="demo"
                        className="absolute inset-[2px] aspect-square h-full w-full rounded object-contain bg-gray-100 p-1" 
                        width={170} 
                        height={170}
                />
                ) : (
                    <div 
                        className="pointer-events-none absolute grid place-content-center z-10 inset-[3px] h-[166px] w-[166px]"
                    >
                        Subir imagen
                    </div>
                )
                }
                <Input
                className="inset-0 w-[170px] h-[170px] text-black" 
                name="image" 
                type="file" 
                accept="image/*" 
                capture="user" 
                required
                onChange={(event) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            setPreview(event.target.files?.[0])
                            setLocation({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            })
                        },
                        () => {
                            alert(
                                "No se pudo verificar si el usuario se encuentra en Argentina para poder realizar la transferencia"
                            );
                            event.target.value = ""
                        },
                        {
                            enableHighAccuracy: true
                        }
                    )
                }}        
                />
          </div>
        </div>
      </Label>
      <Label className="flex items-center gap-2">
        <Checkbox name="tos" required/>
          Acepto los {" "}
          <Link className="underline" href="/tos">
            terminos y condiciones
          </Link>
      </Label>
      <Button type="submit">Enviar dinero</Button>
    </form>
  );
}

