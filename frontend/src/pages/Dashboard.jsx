import React, { useMemo, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { toast } from "../hooks/use-toast";
import { currencyIDR, loadData, saveData } from "../mock/mock";
import { Copy, Plus, Search, Trash2, Download, Wand2 } from "lucide-react";

const SectionHeader = ({ title, extra }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
    <div className="flex items-center gap-2">{extra}</div>
  </div>
);

export default function Dashboard() {
  const [active, setActive] = useState("overview");
  const [data, setData] = useState(loadData());
  const [query, setQuery] = useState("");

  useEffect(() => {
    // ensure initial save
    saveData(data);
  }, []);

  const update = (patch) => {
    const next = { ...data, ...patch };
    setData(next);
    saveData(next);
  };

  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase();
    return data.products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [data.products, query]);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Disalin ke clipboard" });
    } catch {
      toast({ title: "Gagal menyalin", variant: "destructive" });
    }
  };

  const addProduct = () => {
    const id = "p" + Math.random().toString(36).slice(2, 7);
    const np = { id, name: "Produk Baru", category: "Lainnya", price: 0, commission: 10, active: true, url: "https://merchant.com/?ref=YOURID" };
    update({ products: [np, ...data.products] });
  };

  const updateProduct = (id, patch) => {
    update({ products: data.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  };

  const removeProduct = (id) => {
    update({ products: data.products.filter((p) => p.id !== id) });
  };

  const addCampaign = () => {
    const id = "c" + Math.random().toString(36).slice(2, 7);
    const nc = { id, name: "Kampanye Baru", budget: 0, status: "aktif", start: new Date().toISOString().slice(0,10), end: new Date().toISOString().slice(0,10), utm: { source: "seo", medium: "blog", campaign: id } };
    update({ campaigns: [nc, ...data.campaigns] });
  };

  const updateCampaign = (id, patch) => {
    update({ campaigns: data.campaigns.map(c => c.id === id ? { ...c, ...patch } : c) });
  };

  const removeCampaign = (id) => update({ campaigns: data.campaigns.filter(c => c.id !== id) });

  const addCoupon = () => {
    const id = "cp" + Math.random().toString(36).slice(2, 7);
    const nc = { id, code: "NEW10", discount: 10, usage: 0, active: true };
    update({ coupons: [nc, ...data.coupons] });
  };

  const updateCoupon = (id, patch) => update({ coupons: data.coupons.map(c => c.id === id ? { ...c, ...patch } : c) });
  const removeCoupon = (id) => update({ coupons: data.coupons.filter(c => c.id !== id) });

  const exportCSV = () => {
    const rows = [];
    rows.push(["type","id","name","category","price","commission","active"].join(","));
    data.products.forEach(p => rows.push(["product",p.id,p.name,p.category,p.price,p.commission,p.active].join(",")));
    rows.push("\n");
    rows.push(["type","id","name","budget","status","start","end"].join(","));
    data.campaigns.forEach(c => rows.push(["campaign",c.id,c.name,c.budget,c.status,c.start,c.end].join(",")));
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "affipro_export.csv"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV diekspor" });
  };

  const Overview = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        {[{label: "Klik", value: data.metrics.clicks}, {label: "Konversi", value: data.metrics.conversions}, {label: "Pendapatan", value: currencyIDR(data.metrics.revenue)}, {label: "CTR", value: data.metrics.ctr + "%"}].map((m, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="text-sm text-stone-500">{m.label}</div>
              <div className="text-2xl font-semibold text-stone-900 mt-1">{m.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-5">
          <SectionHeader title="Klik Terbaru" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Kampanye</TableHead>
                <TableHead>Waktu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.clicks.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{data.products.find(p => p.id===c.productId)?.name || c.productId}</TableCell>
                  <TableCell className="uppercase">{c.source}</TableCell>
                  <TableCell>{data.campaigns.find(k=>k.id===c.campaignId)?.name || c.campaignId}</TableCell>
                  <TableCell>{new Date(c.ts).toLocaleString("id-ID")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const Products = () => (
    <div className="space-y-4">
      <SectionHeader title="Produk Afiliasi" extra={<>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 text-stone-400" size={16} />
          <Input placeholder="Cari produk..." className="pl-8 w-64" value={query} onChange={(e)=>setQuery(e.target.value)} />
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={addProduct}><Plus size={16} />Tambah</Button>
      </>} />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Komisi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right pr-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Input value={p.name} onChange={(e)=>updateProduct(p.id,{name:e.target.value})} />
                  </TableCell>
                  <TableCell>
                    <Input value={p.category} onChange={(e)=>updateProduct(p.id,{category:e.target.value})} />
                  </TableCell>
                  <TableCell>
                    <Input type="number" value={p.price} onChange={(e)=>updateProduct(p.id,{price:Number(e.target.value)})} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input type="number" value={p.commission} onChange={(e)=>updateProduct(p.id,{commission:Number(e.target.value)})} />
                      <span className="text-sm text-stone-500">%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select value={p.active?"aktif":"nonaktif"} onValueChange={(v)=>updateProduct(p.id,{active: v==="aktif"})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="nonaktif">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input value={p.url} onChange={(e)=>updateProduct(p.id,{url:e.target.value})} />
                      <Button variant="outline" onClick={()=>copy(p.url)}><Copy size={14} /></Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button variant="destructive" onClick={()=>removeProduct(p.id)}><Trash2 size={14} /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const Campaigns = () => (
    <div className="space-y-4">
      <SectionHeader title="Kampanye" extra={<>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={addCampaign}><Plus size={16} />Tambah</Button>
      </>} />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead>Selesai</TableHead>
                <TableHead>UTM</TableHead>
                <TableHead className="text-right pr-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.campaigns.map(c => (
                <TableRow key={c.id}>
                  <TableCell><Input value={c.name} onChange={(e)=>updateCampaign(c.id,{name:e.target.value})} /></TableCell>
                  <TableCell><Input type="number" value={c.budget} onChange={(e)=>updateCampaign(c.id,{budget:Number(e.target.value)})} /></TableCell>
                  <TableCell>
                    <Select value={c.status} onValueChange={(v)=>updateCampaign(c.id,{status:v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="pause">Pause</SelectItem>
                        <SelectItem value="selesai">Selesai</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><Input type="date" value={c.start} onChange={(e)=>updateCampaign(c.id,{start:e.target.value})} /></TableCell>
                  <TableCell><Input type="date" value={c.end} onChange={(e)=>updateCampaign(c.id,{end:e.target.value})} /></TableCell>
                  <TableCell>
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="source" value={c.utm.source} onChange={(e)=>updateCampaign(c.id,{utm:{...c.utm, source:e.target.value}})} />
                      <Input placeholder="medium" value={c.utm.medium} onChange={(e)=>updateCampaign(c.id,{utm:{...c.utm, medium:e.target.value}})} />
                      <Input placeholder="campaign" value={c.utm.campaign} onChange={(e)=>updateCampaign(c.id,{utm:{...c.utm, campaign:e.target.value}})} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button variant="destructive" onClick={()=>removeCampaign(c.id)}><Trash2 size={14} /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const UTMBuilder = () => {
    const [form, setForm] = useState({ base: "https://yourblog.com/post", source: "seo", medium: "blog", campaign: "", term: "", content: "" });
    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
    const build = () => {
      const params = new URLSearchParams();
      if (form.source) params.set("utm_source", form.source);
      if (form.medium) params.set("utm_medium", form.medium);
      if (form.campaign) params.set("utm_campaign", form.campaign);
      if (form.term) params.set("utm_term", form.term);
      if (form.content) params.set("utm_content", form.content);
      const url = `${form.base}${form.base.includes("?")?"&":"?"}${params.toString()}`;
      toast({ title: "URL UTM dibuat" });
      const id = "u" + Math.random().toString(36).slice(2, 7);
      const item = { id, title: form.campaign || form.source, url };
      update({ utmLinks: [item, ...data.utmLinks] });
      navigator.clipboard.writeText(url).catch(()=>{});
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-5 space-y-4">
            <SectionHeader title="UTM Builder" />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-stone-600">Base URL</label>
                <Input value={form.base} onChange={(e)=>set("base", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-stone-600">Pilih Kampanye</label>
                <Select value={form.campaign} onValueChange={(v)=>set("campaign", v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih kampanye (opsional)" /></SelectTrigger>
                  <SelectContent>
                    {data.campaigns.map(c => <SelectItem key={c.id} value={c.utm.campaign}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-stone-600">Source</label>
                <Select value={form.source} onValueChange={(v)=>set("source", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['seo','newsletter','ads','social','referral'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-stone-600">Medium</label>
                <Select value={form.medium} onValueChange={(v)=>set("medium", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['blog','email','cpc','organic','influencer'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-stone-600">Term (opsional)</label>
                <Input value={form.term} onChange={(e)=>set("term", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-stone-600">Content (opsional)</label>
                <Input value={form.content} onChange={(e)=>set("content", e.target.value)} />
              </div>
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={build}><Wand2 size={16} />Buat & Salin URL</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <SectionHeader title="Link Tersimpan" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right pr-4">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.utmLinks.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>{u.title}</TableCell>
                    <TableCell className="truncate max-w-[600px]"><a href={u.url} className="text-teal-700 hover:underline" target="_blank" rel="noreferrer">{u.url}</a></TableCell>
                    <TableCell className="text-right pr-4">
                      <Button variant="outline" onClick={()=>copy(u.url)}><Copy size={14} /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  const Coupons = () => (
    <div className="space-y-4">
      <SectionHeader title="Kupon" extra={<>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={addCoupon}><Plus size={16} />Tambah</Button>
      </>} />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Diskon</TableHead>
                <TableHead>Penggunaan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.coupons.map(cp => (
                <TableRow key={cp.id}>
                  <TableCell><Input value={cp.code} onChange={(e)=>updateCoupon(cp.id,{code:e.target.value})} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2"><Input type="number" value={cp.discount} onChange={(e)=>updateCoupon(cp.id,{discount:Number(e.target.value)})} /><span className="text-sm text-stone-500">%</span></div>
                  </TableCell>
                  <TableCell>{cp.usage}</TableCell>
                  <TableCell>
                    <Select value={cp.active?"aktif":"nonaktif"} onValueChange={(v)=>updateCoupon(cp.id,{active:v==="aktif"})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="nonaktif">Nonaktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <Button variant="destructive" onClick={()=>removeCoupon(cp.id)}><Trash2 size={14} /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const Exports = () => (
    <div className="space-y-4">
      <SectionHeader title="Ekspor Data" />
      <Card>
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <div className="font-medium">Unduh CSV Produk & Kampanye</div>
            <div className="text-sm text-stone-600">Siap untuk laporan atau analisis lanjutan.</div>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white" onClick={exportCSV}><Download size={16} />Unduh CSV</Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="flex">
        <Sidebar active={active} onChange={setActive} />
        <div className="flex-1">
          <div className="hidden md:flex h-14 items-center justify-between px-6 border-b bg-white sticky top-0 z-30">
            <div className="font-medium text-stone-700">Dashboard</div>
            <div className="text-xs text-stone-500">Mock data — belum terhubung backend</div>
          </div>
          <main className="p-4 md:p-6 max-w-6xl">
            {active === "overview" && <Overview />}
            {active === "products" && <Products />}
            {active === "campaigns" && <Campaigns />}
            {active === "utm" && <UTMBuilder />}
            {active === "coupons" && <Coupons />}
            {active === "exports" && <Exports />}
          </main>
        </div>
      </div>
    </div>
  );
}