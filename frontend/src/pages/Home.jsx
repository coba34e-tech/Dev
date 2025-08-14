import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { CheckCircle2, BarChart3, Link2, Megaphone, TicketPercent } from "lucide-react";

const heroImg = "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b"; // curated by vision agent

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold text-stone-800 text-lg">AffiPro<span className="text-teal-700">.SEO</span></Link>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">Buka Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-stone-900">Homepage Afiliasi Powerful-SEO</h1>
            <p className="mt-4 text-stone-600">Bangun landing afiliasi modern, cepat, dengan struktur SEO rapi dan dashboard pengelolaan pro: kampanye, UTM builder, kupon, dan ekspor data.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/dashboard">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">Mulai Sekarang</Button>
              </Link>
              <a href="#fitur" className="text-teal-700 hover:underline text-sm mt-2">Lihat fitur</a>
            </div>
          </div>
          <div>
            <img src={heroImg} alt="analytics hero" className="w-full rounded-xl shadow border object-cover" />
          </div>
        </section>

        <section id="fitur" className="mt-16">
          <h2 className="text-2xl font-semibold text-stone-900">Fitur Utama</h2>
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            {[{icon: BarChart3, title: "SEO Landing", desc: "Section terstruktur, heading rapi, performa cepat."},
              {icon: Megaphone, title: "Kampanye Pro", desc: "Kelola kampanye, anggaran, status, timeline."},
              {icon: Link2, title: "UTM Builder", desc: "Bangun URL UTM siap pakai dan simpan."},
              {icon: TicketPercent, title: "Kupon", desc: "Kode promo siap lacak & aktif/nonaktif."}].map((f, idx) => (
              <Card key={idx}>
                <CardContent className="p-5">
                  <f.icon className="text-teal-700" />
                  <div className="mt-3 font-medium">{f.title}</div>
                  <p className="text-sm text-stone-600 mt-1">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex items-center text-stone-600 text-sm gap-2">
            <CheckCircle2 className="text-teal-700" size={16} />
            Frontend ini memakai data mock di browser (tanpa backend) untuk demo cepat.
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-stone-600">© 2025 AffiPro.SEO — Demo mock frontend</div>
      </footer>
    </div>
  );
}